const prisma = require('../../database/prismaClient');
const marketplace = require('../../marketplace');
const NotFoundError = require('../../errors/NotFoundError');
const AuthorizationError = require('../../errors/AuthorizationError');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');
const { STATUS, MOVEMENT_TYPE } = require('../constants/inventory.constants');

// ---- Single source of truth for status derivation (spec explicitly
// requires backend to be authoritative, never recomputed differently
// in seller dashboard / product page / admin dashboard). ----
const calculateStatus = ({ quantity, reservedQuantity, lowStockThreshold, allowBackorder }) => {
  const available = quantity - reservedQuantity;

  if (available <= 0) {
    return allowBackorder ? STATUS.BACKORDER : STATUS.OUT_OF_STOCK;
  }
  if (available <= lowStockThreshold) {
    return STATUS.LOW_STOCK;
  }
  return STATUS.IN_STOCK;
};

const withAvailable = (inv) => ({ ...inv, availableQuantity: inv.quantity - inv.reservedQuantity });

// ---- Ownership resolution (same pattern as Phase 22/23) ----

const getSellerByUserId = async (userId) => {
  const seller = await prisma.seller.findUnique({ where: { userId } });
  if (!seller || seller.deletedAt) throw new NotFoundError('Seller profile not found', errorCodes.SELLER_NOT_FOUND);
  return seller;
};

const getOwnedProduct = async (sellerId, productId) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.deletedAt) throw new NotFoundError('Product not found', errorCodes.PRODUCT_NOT_FOUND);
  if (product.sellerId !== sellerId) throw new AuthorizationError('You do not have access to this product');
  return product;
};

const getOwnedInventory = async (userId, inventoryId) => {
  const seller = await getSellerByUserId(userId);
  const inventory = await prisma.inventory.findUnique({ where: { id: inventoryId } });
  if (!inventory || inventory.deletedAt) throw new NotFoundError('Inventory record not found', errorCodes.INVENTORY_NOT_FOUND);
  if (inventory.sellerId !== seller.id) throw new AuthorizationError('You do not have access to this inventory record');
  return inventory;
};

// ---- Create initial inventory (transactional: Inventory + StockMovement) ----

const createInventory = async (userId, productId, data) => {
  const seller = await getSellerByUserId(userId);
  const product = await getOwnedProduct(seller.id, productId);

  if (data.variantId) {
    const variant = await prisma.variantCombination.findUnique({ where: { id: data.variantId } });
    if (!variant || variant.productId !== productId) {
      throw new AppError('Variant does not belong to this product', httpStatus.BAD_REQUEST, errorCodes.INVALID_VARIANT_ASSOCIATION);
    }
    const existingForVariant = await prisma.inventory.findUnique({ where: { variantId: data.variantId } });
    if (existingForVariant) throw new AppError('Inventory already exists for this variant', httpStatus.CONFLICT, errorCodes.DUPLICATE_INVENTORY);
  } else {
    const existingForProduct = await prisma.inventory.findFirst({ where: { productId, variantId: null, deletedAt: null } });
    if (existingForProduct) throw new AppError('Inventory already exists for this product', httpStatus.CONFLICT, errorCodes.DUPLICATE_INVENTORY);
  }

  const lowStockThreshold = data.lowStockThreshold ?? 5;
  const status = calculateStatus({
    quantity: data.quantity,
    reservedQuantity: 0,
    lowStockThreshold,
    allowBackorder: data.allowBackorder ?? false,
  });

  const result = await prisma.$transaction(async (tx) => {
    const inventory = await tx.inventory.create({
      data: {
        productId,
        variantId: data.variantId || null,
        sellerId: seller.id,
        storeId: product.storeId,
        sku: data.sku || null,
        quantity: data.quantity,
        reservedQuantity: 0,
        lowStockThreshold,
        reorderPoint: data.reorderPoint ?? 0,
        allowBackorder: data.allowBackorder ?? false,
        status,
      },
    });

    await tx.stockMovement.create({
      data: {
        inventoryId: inventory.id,
        type: MOVEMENT_TYPE.INITIAL_STOCK,
        quantity: data.quantity,
        previousQuantity: 0,
        newQuantity: data.quantity,
        reason: 'Initial stock',
        performedById: userId,
      },
    });

    return inventory;
  });

  return withAvailable(result);
};

// ---- Read ----

const listMyInventory = async (userId, { page, limit, status, search, lowStockOnly, outOfStockOnly, sort } = {}) => {
  const seller = await getSellerByUserId(userId);
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { resolveSort } = marketplace.helpers.sorting;
  const ALLOWED = require('../constants/inventory.constants').ALLOWED_SORT_FIELDS;
  const { skip, take, page: safePage, limit: safeLimit } = resolvePagination({ page, limit });
  const orderBy = resolveSort(sort, ALLOWED, 'updatedAt');

  const where = {
    sellerId: seller.id,
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(lowStockOnly === 'true' ? { status: STATUS.LOW_STOCK } : {}),
    ...(outOfStockOnly === 'true' ? { status: STATUS.OUT_OF_STOCK } : {}),
    ...(search
      ? { OR: [{ sku: { contains: search, mode: 'insensitive' } }, { product: { name: { contains: search, mode: 'insensitive' } } }] }
      : {}),
  };

  const [items, totalCount] = await Promise.all([
    prisma.inventory.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        product: { select: { id: true, name: true, slug: true, sku: true, category: { select: { name: true } } } },
        variant: { select: { id: true, name: true, sku: true } },
      },
    }),
    prisma.inventory.count({ where }),
  ]);

  return { items: items.map(withAvailable), meta: buildPaginationMeta({ page: safePage, limit: safeLimit, totalCount }) };
};

const getInventoryDetail = async (userId, inventoryId) => {
  const inventory = await getOwnedInventory(userId, inventoryId);
  const full = await prisma.inventory.findUnique({
    where: { id: inventoryId },
    include: { product: { select: { id: true, name: true, slug: true } }, variant: { select: { id: true, name: true } } },
  });
  return withAvailable(full);
};

const getSummary = async (userId) => {
  const seller = await getSellerByUserId(userId);
  const where = { sellerId: seller.id, deletedAt: null };

  const [totalProducts, aggregates, lowStockCount, outOfStockCount, reservedAgg, recentMovements] = await Promise.all([
    prisma.inventory.count({ where }),
    prisma.inventory.aggregate({ where, _sum: { quantity: true } }),
    prisma.inventory.count({ where: { ...where, status: STATUS.LOW_STOCK } }),
    prisma.inventory.count({ where: { ...where, status: STATUS.OUT_OF_STOCK } }),
    prisma.inventory.aggregate({ where, _sum: { reservedQuantity: true } }),
    prisma.stockMovement.findMany({
      where: { inventory: { sellerId: seller.id } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { inventory: { select: { product: { select: { name: true } }, variant: { select: { name: true } } } } },
    }),
  ]);

  return {
    totalInventoryRecords: totalProducts,
    totalStockUnits: aggregates._sum.quantity || 0,
    lowStockCount,
    outOfStockCount,
    totalReservedUnits: reservedAgg._sum.reservedQuantity || 0,
    inventoryValue: null, // placeholder — real value requires Phase 25 pricing; never invent a number
    recentMovements,
  };
};

// ---- Transactional stock mutation core (all seller-triggered
// adjustments/restocks funnel through here to guarantee identical
// concurrency-safety and status-recalculation behavior). ----

const applyStockChange = async (userId, inventoryId, { delta, type, reason, referenceType = null, referenceId = null }) => {
  // Retry loop for optimistic-concurrency contention: if two requests
  // race on the same inventory row, the loser's conditional update
  // matches 0 rows and we retry against the freshly-read state rather
  // than surfacing a spurious error to a legitimate second request —
  // this correctly handles the spec's "10 -7 and -5 simultaneously"
  // scenario by serializing the two writes instead of losing one.
  const MAX_RETRIES = 5;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    // eslint-disable-next-line no-await-in-loop
    const inventory = await getOwnedInventory(userId, inventoryId);

    const newQuantity = inventory.quantity + delta;

    if (newQuantity < 0 && !inventory.allowBackorder) {
      throw new AppError(
        `Insufficient stock: current quantity is ${inventory.quantity}, cannot apply change of ${delta}`,
        httpStatus.CONFLICT,
        errorCodes.NEGATIVE_STOCK_REJECTED
      );
    }

    const newStatus = calculateStatus({
      quantity: newQuantity,
      reservedQuantity: inventory.reservedQuantity,
      lowStockThreshold: inventory.lowStockThreshold,
      allowBackorder: inventory.allowBackorder,
    });

    // eslint-disable-next-line no-await-in-loop
    const updateResult = await prisma.inventory.updateMany({
      where: { id: inventoryId, version: inventory.version },
      data: { quantity: newQuantity, status: newStatus, version: { increment: 1 } },
    });

    if (updateResult.count === 1) {
      // eslint-disable-next-line no-await-in-loop
      await prisma.stockMovement.create({
        data: {
          inventoryId,
          type,
          quantity: delta,
          previousQuantity: inventory.quantity,
          newQuantity,
          reason,
          referenceType,
          referenceId,
          performedById: userId,
        },
      });
      // eslint-disable-next-line no-await-in-loop
      const updated = await prisma.inventory.findUnique({ where: { id: inventoryId } });
      return withAvailable(updated);
    }
    // count === 0 means another request updated the row between our
    // read and write — loop again against fresh data.
  }

  throw new AppError('Too many concurrent updates to this inventory record. Please try again.', httpStatus.CONFLICT, errorCodes.CONCURRENT_MODIFICATION);
};

const adjustStock = (userId, inventoryId, { quantity, type, reason }) =>
  applyStockChange(userId, inventoryId, { delta: quantity, type: type || MOVEMENT_TYPE.MANUAL_ADJUSTMENT, reason });

const restockInventory = (userId, inventoryId, { quantity, reason }) =>
  applyStockChange(userId, inventoryId, { delta: quantity, type: MOVEMENT_TYPE.RESTOCK, reason });

const updateThreshold = async (userId, inventoryId, data) => {
  const inventory = await getOwnedInventory(userId, inventoryId);

  const merged = { ...inventory, ...data };
  const newStatus = calculateStatus({
    quantity: merged.quantity,
    reservedQuantity: merged.reservedQuantity,
    lowStockThreshold: merged.lowStockThreshold,
    allowBackorder: merged.allowBackorder,
  });

  const updated = await prisma.inventory.update({ where: { id: inventoryId }, data: { ...data, status: newStatus } });
  return withAvailable(updated);
};

const getStockHistory = async (userId, inventoryId, { page, limit } = {}) => {
  await getOwnedInventory(userId, inventoryId);
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { skip, take, page: safePage, limit: safeLimit } = resolvePagination({ page, limit });

  const [items, totalCount] = await Promise.all([
    prisma.stockMovement.findMany({ where: { inventoryId }, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.stockMovement.count({ where: { inventoryId } }),
  ]);

  return { items, meta: buildPaginationMeta({ page: safePage, limit: safeLimit, totalCount }) };
};

// ---- Reservation foundation (for future Cart/Checkout — not called
// by any route in this phase, but implemented now per spec so the
// order system can call these directly without inventory redesign). ----

const reserveStock = async (inventoryId, quantity, { referenceType, referenceId } = {}) => {
  if (quantity <= 0) throw new AppError('Reservation quantity must be positive', httpStatus.BAD_REQUEST, errorCodes.VALIDATION_FAILED);

  const MAX_RETRIES = 5;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    // eslint-disable-next-line no-await-in-loop
    const inventory = await prisma.inventory.findUnique({ where: { id: inventoryId } });
    if (!inventory || inventory.deletedAt) throw new NotFoundError('Inventory record not found', errorCodes.INVENTORY_NOT_FOUND);

    const available = inventory.quantity - inventory.reservedQuantity;
    if (quantity > available && !inventory.allowBackorder) {
      throw new AppError('Cannot reserve more than available stock', httpStatus.CONFLICT, errorCodes.INSUFFICIENT_STOCK);
    }

    const newReserved = inventory.reservedQuantity + quantity;
    const newStatus = calculateStatus({ quantity: inventory.quantity, reservedQuantity: newReserved, lowStockThreshold: inventory.lowStockThreshold, allowBackorder: inventory.allowBackorder });

    // eslint-disable-next-line no-await-in-loop
    const updateResult = await prisma.inventory.updateMany({
      where: { id: inventoryId, version: inventory.version },
      data: { reservedQuantity: newReserved, status: newStatus, version: { increment: 1 } },
    });

    if (updateResult.count === 1) {
      // eslint-disable-next-line no-await-in-loop
      await prisma.stockMovement.create({
        data: { inventoryId, type: MOVEMENT_TYPE.RESERVATION, quantity, previousQuantity: inventory.reservedQuantity, newQuantity: newReserved, reason: 'Stock reserved', referenceType, referenceId },
      });
      // eslint-disable-next-line no-await-in-loop
      return withAvailable(await prisma.inventory.findUnique({ where: { id: inventoryId } }));
    }
  }
  throw new AppError('Too many concurrent updates. Please try again.', httpStatus.CONFLICT, errorCodes.CONCURRENT_MODIFICATION);
};

const releaseStock = async (inventoryId, quantity, { referenceType, referenceId } = {}) => {
  if (quantity <= 0) throw new AppError('Release quantity must be positive', httpStatus.BAD_REQUEST, errorCodes.VALIDATION_FAILED);

  const MAX_RETRIES = 5;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    // eslint-disable-next-line no-await-in-loop
    const inventory = await prisma.inventory.findUnique({ where: { id: inventoryId } });
    if (!inventory || inventory.deletedAt) throw new NotFoundError('Inventory record not found', errorCodes.INVENTORY_NOT_FOUND);

    const newReserved = Math.max(0, inventory.reservedQuantity - quantity);
    const newStatus = calculateStatus({ quantity: inventory.quantity, reservedQuantity: newReserved, lowStockThreshold: inventory.lowStockThreshold, allowBackorder: inventory.allowBackorder });

    // eslint-disable-next-line no-await-in-loop
    const updateResult = await prisma.inventory.updateMany({
      where: { id: inventoryId, version: inventory.version },
      data: { reservedQuantity: newReserved, status: newStatus, version: { increment: 1 } },
    });

    if (updateResult.count === 1) {
      // eslint-disable-next-line no-await-in-loop
      await prisma.stockMovement.create({
        data: { inventoryId, type: MOVEMENT_TYPE.RELEASE, quantity, previousQuantity: inventory.reservedQuantity, newQuantity: newReserved, reason: 'Stock released', referenceType, referenceId },
      });
      // eslint-disable-next-line no-await-in-loop
      return withAvailable(await prisma.inventory.findUnique({ where: { id: inventoryId } }));
    }
  }
  throw new AppError('Too many concurrent updates. Please try again.', httpStatus.CONFLICT, errorCodes.CONCURRENT_MODIFICATION);
};

// Consumes reserved stock permanently (order finalized): decrements
// both quantity and reservedQuantity by the same amount.
const consumeStock = async (inventoryId, quantity, { referenceType, referenceId } = {}) => {
  const inventory = await prisma.inventory.findUnique({ where: { id: inventoryId } });
  if (!inventory) throw new NotFoundError('Inventory record not found', errorCodes.INVENTORY_NOT_FOUND);

  const newQuantity = inventory.quantity - quantity;
  const newReserved = Math.max(0, inventory.reservedQuantity - quantity);
  const newStatus = calculateStatus({ quantity: newQuantity, reservedQuantity: newReserved, lowStockThreshold: inventory.lowStockThreshold, allowBackorder: inventory.allowBackorder });

  const updated = await prisma.inventory.update({
    where: { id: inventoryId },
    data: { quantity: newQuantity, reservedQuantity: newReserved, status: newStatus, version: { increment: 1 } },
  });
  await prisma.stockMovement.create({
    data: { inventoryId, type: MOVEMENT_TYPE.SALE, quantity: -quantity, previousQuantity: inventory.quantity, newQuantity, reason: 'Order fulfilled', referenceType, referenceId },
  });
  return withAvailable(updated);
};

// Restores previously-consumed stock (order cancelled/returned).
const restoreStock = async (inventoryId, quantity, { referenceType, referenceId } = {}) => {
  const inventory = await prisma.inventory.findUnique({ where: { id: inventoryId } });
  if (!inventory) throw new NotFoundError('Inventory record not found', errorCodes.INVENTORY_NOT_FOUND);

  const newQuantity = inventory.quantity + quantity;
  const newStatus = calculateStatus({ quantity: newQuantity, reservedQuantity: inventory.reservedQuantity, lowStockThreshold: inventory.lowStockThreshold, allowBackorder: inventory.allowBackorder });

  const updated = await prisma.inventory.update({
    where: { id: inventoryId },
    data: { quantity: newQuantity, status: newStatus, version: { increment: 1 } },
  });
  await prisma.stockMovement.create({
    data: { inventoryId, type: MOVEMENT_TYPE.RETURN, quantity, previousQuantity: inventory.quantity, newQuantity, reason: 'Stock restored', referenceType, referenceId },
  });
  return withAvailable(updated);
};

// ---- Admin ----

const listAllInventory = async ({ page, limit, status, search, sort } = {}) => {
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { resolveSort } = marketplace.helpers.sorting;
  const ALLOWED = require('../constants/inventory.constants').ALLOWED_SORT_FIELDS;
  const { skip, take, page: safePage, limit: safeLimit } = resolvePagination({ page, limit });
  const orderBy = resolveSort(sort, ALLOWED, 'updatedAt');

  const where = {
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(search ? { OR: [{ sku: { contains: search, mode: 'insensitive' } }, { product: { name: { contains: search, mode: 'insensitive' } } }] } : {}),
  };

  const [items, totalCount] = await Promise.all([
    prisma.inventory.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        product: { select: { name: true, slug: true } },
        variant: { select: { name: true } },
        seller: { select: { user: { select: { firstName: true, lastName: true, email: true } } } },
        store: { select: { name: true } },
      },
    }),
    prisma.inventory.count({ where }),
  ]);

  return { items: items.map(withAvailable), meta: buildPaginationMeta({ page: safePage, limit: safeLimit, totalCount }) };
};

const adminAdjustStock = async (adminId, inventoryId, { quantity, reason }) => {
  const inventory = await prisma.inventory.findUnique({ where: { id: inventoryId } });
  if (!inventory || inventory.deletedAt) throw new NotFoundError('Inventory record not found', errorCodes.INVENTORY_NOT_FOUND);

  const newQuantity = inventory.quantity + quantity;
  if (newQuantity < 0 && !inventory.allowBackorder) {
    throw new AppError('Adjustment would result in negative stock', httpStatus.CONFLICT, errorCodes.NEGATIVE_STOCK_REJECTED);
  }

  const newStatus = calculateStatus({ quantity: newQuantity, reservedQuantity: inventory.reservedQuantity, lowStockThreshold: inventory.lowStockThreshold, allowBackorder: inventory.allowBackorder });

  const updated = await prisma.inventory.update({
    where: { id: inventoryId },
    data: { quantity: newQuantity, status: newStatus, version: { increment: 1 } },
  });
  await prisma.stockMovement.create({
    data: { inventoryId, type: MOVEMENT_TYPE.CORRECTION, quantity, previousQuantity: inventory.quantity, newQuantity, reason: reason || 'Admin correction', performedById: adminId },
  });
  return withAvailable(updated);
};

const adminGetStockHistory = async (inventoryId, { page, limit } = {}) => {
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { skip, take, page: safePage, limit: safeLimit } = resolvePagination({ page, limit });
  const [items, totalCount] = await Promise.all([
    prisma.stockMovement.findMany({ where: { inventoryId }, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.stockMovement.count({ where: { inventoryId } }),
  ]);
  return { items, meta: buildPaginationMeta({ page: safePage, limit: safeLimit, totalCount }) };
};

// ---- Public availability (lightweight — no history, no internals) ----

const getProductAvailability = async (productId) => {
  const inventories = await prisma.inventory.findMany({
    where: { productId, deletedAt: null },
    select: { variantId: true, status: true, quantity: true, reservedQuantity: true, allowBackorder: true },
  });

  if (!inventories.length) return { status: STATUS.OUT_OF_STOCK, variants: [] };

  const simple = inventories.find((i) => !i.variantId);
  if (simple) {
    return { status: simple.status, label: statusLabel(simple.status) };
  }

  return {
    variants: inventories.map((i) => ({
      variantId: i.variantId,
      status: i.status,
      label: statusLabel(i.status),
    })),
  };
};

const getVariantAvailability = async (variantId) => {
  const inventory = await prisma.inventory.findUnique({
    where: { variantId },
    select: { status: true },
  });
  if (!inventory) return { status: STATUS.OUT_OF_STOCK, label: statusLabel(STATUS.OUT_OF_STOCK) };
  return { status: inventory.status, label: statusLabel(inventory.status) };
};

// Never exposes exact quantity publicly, per spec — coarse label only.
function statusLabel(status) {
  const labels = {
    [STATUS.IN_STOCK]: 'In Stock',
    [STATUS.LOW_STOCK]: 'Only a few left',
    [STATUS.OUT_OF_STOCK]: 'Out of Stock',
    [STATUS.BACKORDER]: 'Available on Backorder',
    [STATUS.DISCONTINUED]: 'No Longer Available',
  };
  return labels[status] || 'Unknown';
}

module.exports = {
  calculateStatus,
  createInventory, listMyInventory, getInventoryDetail, getSummary,
  adjustStock, restockInventory, updateThreshold, getStockHistory,
  reserveStock, releaseStock, consumeStock, restoreStock,
  listAllInventory, adminAdjustStock, adminGetStockHistory,
  getProductAvailability, getVariantAvailability,
};