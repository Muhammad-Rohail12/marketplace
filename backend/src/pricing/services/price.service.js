const prisma = require('../../database/prismaClient');
const marketplace = require('../../marketplace');
const NotFoundError = require('../../errors/NotFoundError');
const AuthorizationError = require('../../errors/AuthorizationError');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');
const { PRICE_CHANGE_TYPE } = require('../constants/pricing.constants');
const pricingEngine = require('./pricingEngine.service');

// ---- Ownership resolution (identical pattern to Phases 22-24) ----

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

const getOwnedPrice = async (userId, priceId) => {
  const seller = await getSellerByUserId(userId);
  const price = await prisma.productPrice.findUnique({ where: { id: priceId } });
  if (!price || price.deletedAt) throw new NotFoundError('Price record not found', errorCodes.PRICE_NOT_FOUND);
  if (price.sellerId !== seller.id) throw new AuthorizationError('You do not have access to this price record');
  return price;
};

const recordHistory = (priceId, changeType, field, previousValue, newValue, reason, changedById) =>
  prisma.priceHistory.create({ data: { priceId, changeType, field, previousValue, newValue, reason, changedById } });

// ---- Create initial price (transactional: ProductPrice + PriceHistory) ----

const createPrice = async (userId, productId, data) => {
  const seller = await getSellerByUserId(userId);
  const product = await getOwnedProduct(seller.id, productId);

  if (data.variantId) {
    const variant = await prisma.variantCombination.findUnique({ where: { id: data.variantId } });
    if (!variant || variant.productId !== productId) {
      throw new AppError('Variant does not belong to this product', httpStatus.BAD_REQUEST, errorCodes.INVALID_VARIANT_ASSOCIATION);
    }
    const existing = await prisma.productPrice.findUnique({ where: { variantId: data.variantId } });
    if (existing) throw new AppError('A price already exists for this variant', httpStatus.CONFLICT, errorCodes.DUPLICATE_PRICE);
  } else {
    const existing = await prisma.productPrice.findFirst({ where: { productId, variantId: null, deletedAt: null } });
    if (existing) throw new AppError('A price already exists for this product', httpStatus.CONFLICT, errorCodes.DUPLICATE_PRICE);
  }

  const result = await prisma.$transaction(async (tx) => {
    const price = await tx.productPrice.create({
      data: {
        productId,
        variantId: data.variantId || null,
        sellerId: seller.id,
        storeId: product.storeId,
        currency: data.currency || undefined,
        basePrice: data.basePrice,
        compareAtPrice: data.compareAtPrice ?? null,
        costPrice: data.costPrice ?? null,
        minimumPrice: data.minimumPrice ?? null,
        maximumPrice: data.maximumPrice ?? null,
      },
    });

    await tx.priceHistory.create({
      data: {
        priceId: price.id,
        changeType: PRICE_CHANGE_TYPE.INITIAL_PRICE,
        field: 'basePrice',
        previousValue: null,
        newValue: price.basePrice,
        reason: 'Initial price set',
        changedById: userId,
      },
    });

    return price;
  });

  return result;
};

// ---- Update price (transactional, tracks history per changed field) ----

const updatePrice = async (userId, priceId, data) => {
  const existing = await getOwnedPrice(userId, priceId);

  const changedFields = [];
  ['basePrice', 'compareAtPrice', 'costPrice', 'minimumPrice', 'maximumPrice'].forEach((field) => {
    if (data[field] !== undefined) {
      const prevRaw = existing[field];
      const prevNum = prevRaw === null ? null : Number(prevRaw);
      const nextNum = data[field] === null ? null : Number(data[field]);
      if (prevNum !== nextNum) {
        changedFields.push({ field, previousValue: prevRaw, newValue: data[field] });
      }
    }
  });

  const updated = await prisma.$transaction(async (tx) => {
    const price = await tx.productPrice.update({ where: { id: priceId }, data });

    for (const change of changedFields) {
      // eslint-disable-next-line no-await-in-loop
      await tx.priceHistory.create({
        data: {
          priceId,
          changeType: PRICE_CHANGE_TYPE.PRICE_UPDATE,
          field: change.field,
          previousValue: change.previousValue,
          newValue: change.newValue,
          reason: 'Seller price update',
          changedById: userId,
        },
      });
    }

    return price;
  });

  return updated;
};

const getMyPrice = async (userId, priceId) => {
  const price = await getOwnedPrice(userId, priceId);
  const effective = await pricingEngine.calculateEffectivePrice(price);
  return { ...price, effective };
};

const listMyPricing = async (userId, { page, limit, search, sort } = {}) => {
  const seller = await getSellerByUserId(userId);
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { resolveSort } = marketplace.helpers.sorting;
  const { skip, take, page: safePage, limit: safeLimit } = resolvePagination({ page, limit });
  const orderBy = resolveSort(sort, ['basePrice', 'createdAt', 'updatedAt'], 'updatedAt');

  const where = {
    sellerId: seller.id,
    deletedAt: null,
    ...(search ? { product: { name: { contains: search, mode: 'insensitive' } } } : {}),
  };

  const [items, totalCount] = await Promise.all([
    prisma.productPrice.findMany({
      where,
      orderBy,
      skip,
      take,
      include: { product: { select: { id: true, name: true, slug: true } }, variant: { select: { id: true, name: true } } },
    }),
    prisma.productPrice.count({ where }),
  ]);

  const withEffective = await Promise.all(
    items.map(async (item) => ({ ...item, effective: await pricingEngine.calculateEffectivePrice(item) }))
  );

  return { items: withEffective, meta: buildPaginationMeta({ page: safePage, limit: safeLimit, totalCount }) };
};

const getPriceHistory = async (userId, priceId, { page, limit } = {}) => {
  await getOwnedPrice(userId, priceId);
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { skip, take, page: safePage, limit: safeLimit } = resolvePagination({ page, limit });

  const [items, totalCount] = await Promise.all([
    prisma.priceHistory.findMany({ where: { priceId }, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.priceHistory.count({ where: { priceId } }),
  ]);

  return { items, meta: buildPaginationMeta({ page: safePage, limit: safeLimit, totalCount }) };
};

// ---- Admin ----

const listAllPricing = async ({ page, limit, search, sort } = {}) => {
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { resolveSort } = marketplace.helpers.sorting;
  const { skip, take, page: safePage, limit: safeLimit } = resolvePagination({ page, limit });
  const orderBy = resolveSort(sort, ['basePrice', 'createdAt', 'updatedAt'], 'updatedAt');

  const where = { deletedAt: null, ...(search ? { product: { name: { contains: search, mode: 'insensitive' } } } : {}) };

  const [items, totalCount] = await Promise.all([
    prisma.productPrice.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        product: { select: { name: true, slug: true } },
        seller: { select: { user: { select: { firstName: true, lastName: true, email: true } } } },
        store: { select: { name: true } },
      },
    }),
    prisma.productPrice.count({ where }),
  ]);

  // costPrice remains in this admin-only response by design — admins
  // are permitted to see it for review, unlike public/seller-list contexts.
  return { items, meta: buildPaginationMeta({ page: safePage, limit: safeLimit, totalCount }) };
};

const adminAdjustPrice = async (adminId, priceId, { basePrice, reason }) => {
  const existing = await prisma.productPrice.findUnique({ where: { id: priceId } });
  if (!existing || existing.deletedAt) throw new NotFoundError('Price record not found', errorCodes.PRICE_NOT_FOUND);

  const updated = await prisma.$transaction(async (tx) => {
    const price = await tx.productPrice.update({ where: { id: priceId }, data: { basePrice } });
    await tx.priceHistory.create({
      data: {
        priceId,
        changeType: PRICE_CHANGE_TYPE.ADMIN_ADJUSTMENT,
        field: 'basePrice',
        previousValue: existing.basePrice,
        newValue: basePrice,
        reason,
        changedById: adminId,
      },
    });
    return price;
  });

  return updated;
};

module.exports = {
  getSellerByUserId, getOwnedProduct, getOwnedPrice,
  createPrice, updatePrice, getMyPrice, listMyPricing, getPriceHistory,
  listAllPricing, adminAdjustPrice,
};