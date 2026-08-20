const prisma = require('../../database/prismaClient');
const AppError = require('../../errors/AppError');
const NotFoundError = require('../../errors/NotFoundError');
const AuthorizationError = require('../../errors/AuthorizationError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');
const { STATUS } = require('../constants/cart.constants');
const pricingEngine = require('../../pricing/services/pricingEngine.service');
const { DEFAULT_CURRENCY } = require('../../pricing/constants/pricing.constants');
const { resolveZoneFromState, getShippingOptionsForSeller } = require('../../shipping/services/shippingCalculation.service');

// ... getOrCreateActiveCart, getOwnedCartItem, validateSellableUnit,
//     checkInventory, addItem, updateItemQuantity, removeItem,
//     clearCart — ALL UNCHANGED FROM PHASE 27, preserved verbatim ...

const getOrCreateActiveCart = async (userId) => {
  let cart = await prisma.cart.findFirst({ where: { userId, status: STATUS.ACTIVE } });
  if (!cart) cart = await prisma.cart.create({ data: { userId, status: STATUS.ACTIVE, currency: DEFAULT_CURRENCY } });
  return cart;
};

const getOwnedCartItem = async (userId, itemId) => {
  const item = await prisma.cartItem.findUnique({ where: { id: itemId }, include: { cart: true } });
  if (!item) throw new NotFoundError('Cart item not found', errorCodes.CART_ITEM_NOT_FOUND);
  if (item.cart.userId !== userId) throw new AuthorizationError('You do not have access to this cart item');
  return item;
};

const validateSellableUnit = async (productId, variantId) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.deletedAt) throw new NotFoundError('Product not found', errorCodes.PRODUCT_NOT_FOUND);
  if (product.status !== 'ACTIVE' || product.visibility !== 'PUBLIC') {
    throw new AppError('This product is not currently available', httpStatus.BAD_REQUEST, errorCodes.PRODUCT_UNAVAILABLE);
  }
  let variant = null;
  if (variantId) {
    variant = await prisma.variantCombination.findUnique({ where: { id: variantId } });
    if (!variant || variant.productId !== productId) throw new AppError('Invalid product variant', httpStatus.BAD_REQUEST, errorCodes.INVALID_VARIANT);
    if (variant.status !== 'ACTIVE') throw new AppError('This variant is not currently available', httpStatus.BAD_REQUEST, errorCodes.PRODUCT_UNAVAILABLE);
  } else if (product.productType === 'VARIABLE') {
    throw new AppError('Please select a product variant before adding to cart', httpStatus.BAD_REQUEST, errorCodes.INVALID_VARIANT);
  }
  return { product, variant };
};

const checkInventory = async (productId, variantId, requestedQuantity) => {
  const inventory = variantId
    ? await prisma.inventory.findUnique({ where: { variantId } })
    : await prisma.inventory.findFirst({ where: { productId, variantId: null, deletedAt: null } });
  if (!inventory || inventory.status === 'OUT_OF_STOCK' || inventory.status === 'DISCONTINUED') {
    throw new AppError('This item is currently out of stock', httpStatus.CONFLICT, errorCodes.OUT_OF_STOCK);
  }
  const available = inventory.quantity - inventory.reservedQuantity;
  if (requestedQuantity > available && !inventory.allowBackorder) {
    throw new AppError(`Only ${available} unit(s) are currently available`, httpStatus.CONFLICT, errorCodes.INSUFFICIENT_STOCK);
  }
  return inventory;
};

const addItem = async (userId, { productId, variantId, quantity }) => {
  await validateSellableUnit(productId, variantId);
  const cart = await getOrCreateActiveCart(userId);
  const existingLine = await prisma.cartItem.findUnique({ where: { cartId_productId_variantId: { cartId: cart.id, productId, variantId: variantId ?? null } } });
  const targetQuantity = (existingLine?.quantity || 0) + quantity;
  await checkInventory(productId, variantId, targetQuantity);
  const lineCount = await prisma.cartItem.count({ where: { cartId: cart.id } });
  if (!existingLine && lineCount >= require('../constants/cart.constants').LIMITS.MAX_LINES_PER_CART) {
    throw new AppError('Cart is full — please remove some items first', httpStatus.BAD_REQUEST, errorCodes.VALIDATION_FAILED);
  }
  const item = await prisma.$transaction(async (tx) => {
    if (existingLine) return tx.cartItem.update({ where: { id: existingLine.id }, data: { quantity: targetQuantity } });
    return tx.cartItem.create({ data: { cartId: cart.id, productId, variantId: variantId ?? null, quantity } });
  });
  await prisma.cart.update({ where: { id: cart.id }, data: { updatedAt: new Date() } });
  return item;
};

const updateItemQuantity = async (userId, itemId, quantity) => {
  const item = await getOwnedCartItem(userId, itemId);
  await validateSellableUnit(item.productId, item.variantId);
  await checkInventory(item.productId, item.variantId, quantity);
  return prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
};

const removeItem = async (userId, itemId) => {
  const item = await getOwnedCartItem(userId, itemId);
  await prisma.cartItem.delete({ where: { id: itemId } });
  return item;
};

const clearCart = async (userId) => {
  const cart = await prisma.cart.findFirst({ where: { userId, status: STATUS.ACTIVE } });
  if (!cart) return;
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
};

const isProductShippable = (product) => !['DIGITAL_PLACEHOLDER', 'SERVICE_PLACEHOLDER'].includes(product.productType);

// ---- MODIFIED: buildCartResponse now resolves shipping per group ----

const buildCartResponse = async (userId) => {
  const cart = await prisma.cart.findFirst({
    where: { userId, status: STATUS.ACTIVE },
    include: {
      selectedAddress: true,
      shippingSelections: { include: { method: true } },
      items: {
        include: {
          product: {
            select: {
              id: true, name: true, slug: true, status: true, visibility: true, productType: true,
              store: { select: { id: true, name: true, slug: true, logo: true, sellerId: true } },
              media: { where: { isPrimary: true, status: 'ACTIVE' }, take: 1, select: { url: true, altText: true } },
            },
          },
          variant: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return {
      cart: cart ? { id: cart.id, currency: cart.currency, deliveryAddress: cart.selectedAddress || null } : null,
      sellerGroups: [],
      summary: { itemsSubtotal: 0, totalDiscount: 0, cartSubtotal: 0, shippingTotal: 0, estimatedTotal: 0, currency: DEFAULT_CURRENCY, totalUnits: 0, uniqueLines: 0, shippingComplete: false },
      warnings: [],
    };
  }

  const warnings = [];
  const resolvedItems = [];

  for (const item of cart.items) {
    // eslint-disable-next-line no-await-in-loop
    const pricing = item.variantId
      ? await pricingEngine.getPublicVariantPricing(item.variantId)
      : await pricingEngine.getPublicProductPricing(item.productId);
    // eslint-disable-next-line no-await-in-loop
    const inventory = item.variantId
      ? await prisma.inventory.findUnique({ where: { variantId: item.variantId } })
      : await prisma.inventory.findFirst({ where: { productId: item.productId, variantId: null, deletedAt: null } });

    const isProductGone = item.product.status !== 'ACTIVE' || item.product.visibility !== 'PUBLIC';
    const isVariantGone = item.variantId && !item.variant;
    const available = inventory ? inventory.quantity - inventory.reservedQuantity : 0;
    const isOutOfStock = !inventory || inventory.status === 'OUT_OF_STOCK' || (available <= 0 && !inventory?.allowBackorder);
    const isInsufficient = !isOutOfStock && inventory && item.quantity > available && !inventory.allowBackorder;

    let itemWarning = null;
    if (isProductGone || isVariantGone) itemWarning = 'This item is no longer available';
    else if (isOutOfStock) itemWarning = 'Out of stock';
    else if (isInsufficient) itemWarning = `Only ${available} unit(s) available — reduce quantity`;
    else if (!pricing.hasPrice) itemWarning = 'Price unavailable';
    if (itemWarning) warnings.push({ itemId: item.id, productName: item.product.name, message: itemWarning });

    const effectiveUnitPrice = pricing.hasPrice ? pricing.effectivePrice : 0;
    const lineSubtotal = Math.round(effectiveUnitPrice * item.quantity * 100) / 100;

    resolvedItems.push({
      id: item.id, productId: item.productId, variantId: item.variantId, quantity: item.quantity,
      product: { id: item.product.id, name: item.product.name, slug: item.product.slug, isShippable: isProductShippable(item.product) },
      variant: item.variant ? { id: item.variant.id, name: item.variant.name } : null,
      image: item.product.media?.[0] || null,
      store: item.product.store,
      pricing: {
        currency: pricing.currency || cart.currency, unitPrice: pricing.hasPrice ? pricing.basePrice : null,
        compareAtPrice: pricing.compareAtPrice ?? null, effectivePrice: pricing.hasPrice ? pricing.effectivePrice : null,
        discountAmount: pricing.discountAmount ?? 0, discountPercentage: pricing.discountPercentage ?? 0, hasDiscount: pricing.hasDiscount ?? false,
      },
      lineSubtotal,
      availability: { isAvailable: !isProductGone && !isVariantGone && !isOutOfStock && !isInsufficient, status: isOutOfStock ? 'OUT_OF_STOCK' : isInsufficient ? 'INSUFFICIENT' : 'AVAILABLE', availableQuantity: inventory ? Math.max(0, available) : 0 },
      warning: itemWarning,
    });
  }

  const groupMap = new Map();
  for (const item of resolvedItems) {
    const key = item.store.id;
    if (!groupMap.has(key)) groupMap.set(key, { store: item.store, items: [] });
    groupMap.get(key).items.push(item);
  }

  const zone = cart.selectedAddress ? resolveZoneFromState(cart.selectedAddress.stateCode) : null;
  const existingSelections = new Map(cart.shippingSelections.map((s) => [s.storeId, s]));
  const staleSelectionStoreIds = [];

  const sellerGroups = [];
  for (const group of groupMap.values()) {
    const groupSubtotal = group.items.reduce((sum, i) => sum + i.lineSubtotal, 0);
    const hasNonShippable = group.items.some((i) => !i.product.isShippable);

    let shipping = { options: [], selected: null, error: null };

    if (hasNonShippable) {
      shipping.error = 'One or more items from this seller cannot be shipped';
    } else if (!zone) {
      shipping.error = 'Select a delivery address to see shipping options';
    } else {
      // eslint-disable-next-line no-await-in-loop
      shipping.options = await getShippingOptionsForSeller(group.store.sellerId, zone, groupSubtotal);

      const existing = existingSelections.get(group.store.id);
      if (existing) {
        const stillValid = shipping.options.find((o) => o.shippingMethodId === existing.shippingMethodId);
        if (stillValid && Number(existing.price) === stillValid.price) {
          shipping.selected = { shippingMethodId: existing.shippingMethodId, code: stillValid.code, name: stillValid.name, price: Number(existing.price), minDays: existing.minDays, maxDays: existing.maxDays };
        } else {
          staleSelectionStoreIds.push(group.store.id); // price/zone changed — must reselect
        }
      }

      if (!shipping.options.length) shipping.error = 'No shipping methods are currently available for this destination';
    }

    sellerGroups.push({ store: group.store, items: group.items, shipping });
  }

  // Clean up stale/orphaned selections (address changed invalidating a
  // rate, or a store's items were fully removed from the cart) so the
  // stored selection never silently drifts from what's actually valid.
  const currentStoreIds = new Set(sellerGroups.map((g) => g.store.id));
  const toDelete = cart.shippingSelections
    .filter((s) => staleSelectionStoreIds.includes(s.storeId) || !currentStoreIds.has(s.storeId))
    .map((s) => s.id);
  if (toDelete.length) {
    await prisma.cartShippingSelection.deleteMany({ where: { id: { in: toDelete } } });
    staleSelectionStoreIds.forEach((id) => warnings.push({ itemId: null, productName: null, message: `Shipping was recalculated for one seller — please reselect a method.` }));
  }

  const itemsSubtotal = resolvedItems.reduce((sum, i) => sum + (i.pricing.unitPrice || 0) * i.quantity, 0);
  const cartSubtotal = resolvedItems.reduce((sum, i) => sum + i.lineSubtotal, 0);
  const totalDiscount = Math.round((itemsSubtotal - cartSubtotal) * 100) / 100;
  const totalUnits = resolvedItems.reduce((sum, i) => sum + i.quantity, 0);
  const shippingTotal = sellerGroups.reduce((sum, g) => sum + (g.shipping.selected?.price || 0), 0);
  const shippingComplete = sellerGroups.length > 0 && sellerGroups.every((g) => g.shipping.selected);
  const estimatedTotal = Math.round((cartSubtotal + shippingTotal) * 100) / 100;

  return {
    cart: { id: cart.id, currency: cart.currency, deliveryAddress: cart.selectedAddress || null },
    sellerGroups,
    summary: {
      itemsSubtotal: Math.round(itemsSubtotal * 100) / 100, totalDiscount, cartSubtotal: Math.round(cartSubtotal * 100) / 100,
      shippingTotal: Math.round(shippingTotal * 100) / 100, estimatedTotal, currency: cart.currency,
      totalUnits, uniqueLines: resolvedItems.length, shippingComplete,
    },
    warnings,
  };
};

const validateCart = async (userId) => {
  const { sellerGroups, warnings, cart } = await buildCartResponse(userId);
  const allItems = sellerGroups.flatMap((g) => g.items);

  const errors = allItems.filter((i) => !i.availability.isAvailable).map((i) => `${i.product.name}: ${i.warning}`);

  if (!cart?.deliveryAddress) errors.push('Please select a delivery address');
  else {
    sellerGroups.forEach((g) => {
      if (g.shipping.error) errors.push(`${g.store.name}: ${g.shipping.error}`);
      else if (!g.shipping.selected) errors.push(`Please select a shipping method for ${g.store.name}`);
    });
  }

  return { valid: errors.length === 0 && allItems.length > 0, errors, warnings: warnings.map((w) => w.message) };
};

const getCartItemCount = async (userId) => {
  const cart = await prisma.cart.findFirst({ where: { userId, status: STATUS.ACTIVE }, include: { items: { select: { quantity: true } } } });
  if (!cart) return 0;
  return cart.items.reduce((sum, i) => sum + i.quantity, 0);
};

module.exports = { getOrCreateActiveCart, addItem, updateItemQuantity, removeItem, clearCart, buildCartResponse, validateCart, getCartItemCount };