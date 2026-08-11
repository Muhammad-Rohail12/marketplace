const prisma = require('../../database/prismaClient');
const NotFoundError = require('../../errors/NotFoundError');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');
const { PRICE_CHANGE_TYPE } = require('../constants/pricing.constants');
const { getSellerByUserId, getOwnedPrice } = require('./price.service');

// Prevents accidental discount stacking at the data level: a new
// enabled discount cannot be created for a price record if another
// enabled discount already overlaps its date range — the pricing
// engine only ever picks one anyway (most-recent-wins), but blocking
// creation here keeps the seller's own dashboard from looking
// confusingly like "two discounts are stacked" when only one applies.
const assertNoOverlap = async (priceId, startAt, endAt, excludeId = null) => {
  const candidates = await prisma.discount.findMany({
    where: { priceId, isEnabled: true, deletedAt: null, ...(excludeId ? { id: { not: excludeId } } : {}) },
  });

  const newStart = startAt || new Date(0);
  const newEnd = endAt || new Date('9999-12-31');

  const overlaps = candidates.some((d) => {
    const existingStart = d.startAt || new Date(0);
    const existingEnd = d.endAt || new Date('9999-12-31');
    return newStart <= existingEnd && existingStart <= newEnd;
  });

  if (overlaps) {
    throw new AppError(
      'An active discount already exists for this date range on this product/variant',
      httpStatus.CONFLICT,
      errorCodes.OVERLAPPING_DISCOUNT
    );
  }
};

// ---- Direct product/variant discounts (no deal grouping) ----

const createDiscount = async (userId, priceId, data) => {
  const seller = await getSellerByUserId(userId);
  const price = await getOwnedPrice(userId, priceId);

  if (data.isEnabled !== false) {
    await assertNoOverlap(priceId, data.startAt, data.endAt);
  }

  const discount = await prisma.$transaction(async (tx) => {
    const created = await tx.discount.create({
      data: {
        priceId,
        productId: price.productId,
        variantId: price.variantId,
        sellerId: seller.id,
        storeId: price.storeId,
        type: data.type,
        value: data.value,
        startAt: data.startAt ?? null,
        endAt: data.endAt ?? null,
        isEnabled: data.isEnabled ?? true,
        maxUses: data.maxUses ?? null,
        minimumQuantity: data.minimumQuantity ?? null,
        maximumQuantity: data.maximumQuantity ?? null,
      },
    });

    await tx.priceHistory.create({
      data: {
        priceId,
        changeType: PRICE_CHANGE_TYPE.DISCOUNT_CREATED,
        field: 'discount',
        newValue: created.value,
        reason: `${created.type} discount created`,
        changedById: userId,
      },
    });

    return created;
  });

  return discount;
};

const getOwnedDiscount = async (userId, discountId) => {
  const seller = await getSellerByUserId(userId);
  const discount = await prisma.discount.findUnique({ where: { id: discountId } });
  if (!discount || discount.deletedAt) throw new NotFoundError('Discount not found', errorCodes.DISCOUNT_NOT_FOUND);
  if (discount.sellerId !== seller.id) throw new AppError('You do not have access to this discount', httpStatus.FORBIDDEN, errorCodes.FORBIDDEN);
  return discount;
};

const updateDiscount = async (userId, discountId, data) => {
  const existing = await getOwnedDiscount(userId, discountId);

  if (data.isEnabled === true || (existing.isEnabled && data.isEnabled === undefined)) {
    const startAt = data.startAt !== undefined ? data.startAt : existing.startAt;
    const endAt = data.endAt !== undefined ? data.endAt : existing.endAt;
    await assertNoOverlap(existing.priceId, startAt, endAt, discountId);
  }

  const updated = await prisma.$transaction(async (tx) => {
    const discount = await tx.discount.update({ where: { id: discountId }, data });
    await tx.priceHistory.create({
      data: {
        priceId: existing.priceId,
        changeType: data.isEnabled === false ? PRICE_CHANGE_TYPE.DISCOUNT_DISABLED : PRICE_CHANGE_TYPE.DISCOUNT_UPDATED,
        field: 'discount',
        previousValue: existing.value,
        newValue: discount.value,
        reason: 'Discount updated',
        changedById: userId,
      },
    });
    return discount;
  });

  return updated;
};

const deleteDiscount = async (userId, discountId) => {
  const existing = await getOwnedDiscount(userId, discountId);
  await prisma.$transaction([
    prisma.discount.update({ where: { id: discountId }, data: { deletedAt: new Date(), isEnabled: false } }),
    prisma.priceHistory.create({
      data: { priceId: existing.priceId, changeType: 'DISCOUNT_EXPIRED', field: 'discount', previousValue: existing.value, reason: 'Discount removed by seller' },
    }),
  ]);
};

const listDiscountsForPrice = async (userId, priceId) => {
  await getOwnedPrice(userId, priceId);
  return prisma.discount.findMany({ where: { priceId, deletedAt: null }, orderBy: { createdAt: 'desc' } });
};

// ---- Deals (grouping of discounts across multiple products) ----

const createDeal = async (userId, data) => {
  const seller = await getSellerByUserId(userId);
  return prisma.deal.create({ data: { sellerId: seller.id, ...data } });
};

const getOwnedDeal = async (userId, dealId) => {
  const seller = await getSellerByUserId(userId);
  const deal = await prisma.deal.findUnique({ where: { id: dealId }, include: { discounts: { include: { product: { select: { name: true, slug: true } } } } } });
  if (!deal || deal.deletedAt) throw new NotFoundError('Deal not found', errorCodes.DEAL_NOT_FOUND);
  if (deal.sellerId !== seller.id) throw new AppError('You do not have access to this deal', httpStatus.FORBIDDEN, errorCodes.FORBIDDEN);
  return deal;
};

const listMyDeals = async (userId) => {
  const seller = await getSellerByUserId(userId);
  return prisma.deal.findMany({
    where: { sellerId: seller.id, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: { discounts: { include: { product: { select: { name: true, slug: true } } } } },
  });
};

// Adds a product/variant's discount into a deal, inheriting the
// deal's date range at creation time (a static copy, not a live join
// — keeps read-time status calculation simple and consistent with
// the single-source-of-truth pricing engine).
const addProductToDeal = async (userId, dealId, { productId, variantId, priceId, type, value }) => {
  const deal = await getOwnedDeal(userId, dealId);
  const price = await getOwnedPrice(userId, priceId);

  if (price.productId !== productId || (variantId && price.variantId !== variantId)) {
    throw new AppError('Price record does not match the given product/variant', httpStatus.BAD_REQUEST, errorCodes.VALIDATION_FAILED);
  }

  await assertNoOverlap(priceId, deal.startAt, deal.endAt);

  const seller = await getSellerByUserId(userId);
  return prisma.discount.create({
    data: {
      dealId,
      priceId,
      productId,
      variantId: variantId || null,
      sellerId: seller.id,
      storeId: price.storeId,
      type,
      value,
      startAt: deal.startAt,
      endAt: deal.endAt,
      isEnabled: true,
    },
  });
};

const removeProductFromDeal = async (userId, discountId) => deleteDiscount(userId, discountId);

const setDealEnabled = async (userId, dealId, isEnabled) => {
  const deal = await getOwnedDeal(userId, dealId);

  return prisma.$transaction(async (tx) => {
    const updated = await tx.deal.update({ where: { id: dealId }, data: { isEnabled } });

    // Disabling a deal cascades to pause all its discounts (a seller
    // pulling a promotion expects every product in it to revert
    // immediately). Enabling does NOT force-reactivate discounts the
    // seller individually disabled — avoids surprising re-activation.
    if (!isEnabled) {
      await tx.discount.updateMany({ where: { dealId }, data: { isEnabled: false } });
    }

    return updated;
  });
};

module.exports = {
  createDiscount, updateDiscount, deleteDiscount, listDiscountsForPrice, getOwnedDiscount,
  createDeal, getOwnedDeal, listMyDeals, addProductToDeal, removeProductFromDeal, setDealEnabled,
};