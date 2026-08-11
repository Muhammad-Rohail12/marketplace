const prisma = require('../../database/prismaClient');
const { toCents, fromCents } = require('../utils/money.util');
const { DISCOUNT_TYPE } = require('../constants/pricing.constants');

// ---- Discount resolution: variant-specific discount takes priority
// over product-level discount. Only ONE discount is ever applied —
// no stacking, per spec's explicit "no double discount" rule. ----

const findActiveDiscount = async (priceId, now = new Date()) => {
  return prisma.discount.findFirst({
    where: {
      priceId,
      deletedAt: null,
      isEnabled: true,
      OR: [{ startAt: null }, { startAt: { lte: now } }],
      AND: [{ OR: [{ endAt: null }, { endAt: { gte: now } }] }],
    },
    orderBy: { createdAt: 'desc' }, // tie-breaker: most recently created wins
  });
};

const calculateDiscount = (basePriceCents, discount) => {
  if (!discount) return { discountAmountCents: 0, discountPercentage: 0 };

  let discountAmountCents;
  if (discount.type === DISCOUNT_TYPE.PERCENTAGE) {
    const pct = toCents(discount.value) / 100; // value stored as e.g. 20.00 meaning 20%
    discountAmountCents = Math.round((basePriceCents * pct) / 100);
  } else {
    discountAmountCents = toCents(discount.value);
  }

  // Never let a discount push price below zero, regardless of type.
  discountAmountCents = Math.min(discountAmountCents, basePriceCents);
  discountAmountCents = Math.max(discountAmountCents, 0);

  const discountPercentage = basePriceCents > 0 ? Math.round((discountAmountCents / basePriceCents) * 100) : 0;

  return { discountAmountCents, discountPercentage };
};

// Resolves the authoritative price record for a product's base
// (non-variant) price. Returns null if none configured yet — callers
// must handle "no price set" as a valid, non-error state (a DRAFT
// product legitimately has no price yet).
const resolveProductPrice = async (productId) => {
  return prisma.productPrice.findFirst({ where: { productId, variantId: null, deletedAt: null, isActive: true } });
};

const resolveVariantPrice = async (variantId) => {
  return prisma.productPrice.findUnique({ where: { variantId } });
};

// Core calculation — the ONE place effective price is computed.
// Every consumer (public API, seller dashboard, product card,
// product page) must call through this, never recompute independently.
const calculateEffectivePrice = async (priceRecord) => {
  if (!priceRecord || !priceRecord.isActive) {
    return { hasPrice: false };
  }

  const basePriceCents = toCents(priceRecord.basePrice);
  const activeDiscount = await findActiveDiscount(priceRecord.id);
  const { discountAmountCents, discountPercentage } = calculateDiscount(basePriceCents, activeDiscount);
  const effectivePriceCents = basePriceCents - discountAmountCents;

  return {
    hasPrice: true,
    currency: priceRecord.currency,
    basePrice: fromCents(basePriceCents),
    compareAtPrice: priceRecord.compareAtPrice ? fromCents(toCents(priceRecord.compareAtPrice)) : null,
    effectivePrice: fromCents(effectivePriceCents),
    discountAmount: fromCents(discountAmountCents),
    discountPercentage,
    hasDiscount: discountAmountCents > 0,
    dealId: activeDiscount?.dealId || null,
    discountId: activeDiscount?.id || null,
  };
};

// ---- Public-facing summaries (never include costPrice, minimumPrice,
// maximumPrice, sellerId, storeId, or internal IDs beyond what's
// needed for display) ----

const getPublicProductPricing = async (productId) => {
  const priceRecord = await resolveProductPrice(productId);
  if (!priceRecord) return { hasPrice: false };
  return calculateEffectivePrice(priceRecord);
};

const getPublicVariantPricing = async (variantId) => {
  const priceRecord = await resolveVariantPrice(variantId);
  if (!priceRecord) return { hasPrice: false };
  return calculateEffectivePrice(priceRecord);
};

// Batched lookup for listing pages (ProductCard grids) — avoids N+1
// by resolving all requested products' pricing in limited queries.
const getPublicPricingBatch = async (productIds) => {
  const priceRecords = await prisma.productPrice.findMany({
    where: { productId: { in: productIds }, variantId: null, deletedAt: null, isActive: true },
  });

  const results = {};
  await Promise.all(
    priceRecords.map(async (record) => {
      results[record.productId] = await calculateEffectivePrice(record);
    })
  );
  return results;
};

module.exports = {
  findActiveDiscount,
  calculateDiscount,
  resolveProductPrice,
  resolveVariantPrice,
  calculateEffectivePrice,
  getPublicProductPricing,
  getPublicVariantPricing,
  getPublicPricingBatch,
};