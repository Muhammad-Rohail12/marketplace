const prisma = require('../../database/prismaClient');
const AppError = require('../../errors/AppError');
const NotFoundError = require('../../errors/NotFoundError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');
const { STATUS } = require('../../cart/constants/cart.constants');
const { getShippingOptionsForSeller, resolveZoneFromState } = require('./shippingCalculation.service');

const isProductShippable = (product) => !['DIGITAL_PLACEHOLDER', 'SERVICE_PLACEHOLDER'].includes(product.productType);

// Selecting a shipping option NEVER trusts a client-supplied price —
// it recomputes the group's subtotal and re-derives valid options
// server-side, then only accepts the selection if it matches one of
// those freshly-computed options. The resulting price/estimate is
// snapshotted into CartShippingSelection at that moment (Phase 26's
// "cart is not authoritative forever" principle extended to shipping).
const selectShippingForGroup = async (userId, { storeId, shippingMethodId }) => {
  const cart = await prisma.cart.findFirst({
    where: { userId, status: STATUS.ACTIVE },
    include: { selectedAddress: true },
  });
  if (!cart) throw new NotFoundError('Cart not found', errorCodes.CART_NOT_FOUND);
  if (!cart.selectedAddress) {
    throw new AppError('Select a delivery address first', httpStatus.BAD_REQUEST, errorCodes.SHIPPING_ADDRESS_REQUIRED);
  }

  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) throw new NotFoundError('Store not found', errorCodes.STORE_NOT_FOUND);

  const groupItems = await prisma.cartItem.findMany({
    where: { cartId: cart.id, product: { storeId } },
    include: { product: true },
  });
  if (groupItems.length === 0) {
    throw new AppError('No items from this seller are in your cart', httpStatus.BAD_REQUEST, errorCodes.VALIDATION_FAILED);
  }
  if (groupItems.some((i) => !isProductShippable(i.product))) {
    throw new AppError('One or more items from this seller cannot be shipped', httpStatus.BAD_REQUEST, errorCodes.PRODUCT_NOT_SHIPPABLE);
  }

  // Recompute subtotal authoritatively via the pricing engine rather
  // than trusting any client-sent number.
  const pricingEngine = require('../../pricing/services/pricingEngine.service');
  let subtotal = 0;
  for (const item of groupItems) {
    // eslint-disable-next-line no-await-in-loop
    const pricing = item.variantId
      ? await pricingEngine.getPublicVariantPricing(item.variantId)
      : await pricingEngine.getPublicProductPricing(item.productId);
    subtotal += (pricing.hasPrice ? pricing.effectivePrice : 0) * item.quantity;
  }

  const zone = resolveZoneFromState(cart.selectedAddress.stateCode);
  const options = await getShippingOptionsForSeller(store.sellerId, zone, subtotal);
  const chosen = options.find((o) => o.shippingMethodId === shippingMethodId);

  if (!chosen) {
    throw new AppError(
      'That shipping method is not currently available for this destination',
      httpStatus.BAD_REQUEST,
      errorCodes.INVALID_SHIPPING_SELECTION
    );
  }

  return prisma.cartShippingSelection.upsert({
    where: { cartId_storeId: { cartId: cart.id, storeId } },
    update: { shippingMethodId: chosen.shippingMethodId, price: chosen.price, currency: chosen.currency, minDays: chosen.minDays, maxDays: chosen.maxDays },
    create: { cartId: cart.id, storeId, shippingMethodId: chosen.shippingMethodId, price: chosen.price, currency: chosen.currency, minDays: chosen.minDays, maxDays: chosen.maxDays },
  });
};

module.exports = { selectShippingForGroup };