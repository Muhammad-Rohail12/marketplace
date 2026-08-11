const prisma = require('../../database/prismaClient');
const { resolveZoneFromState } = require('../utils/zoneResolver');

// Returns priced, estimate-attached shipping options for one seller
// group in one zone, given that group's subtotal. This is the ONE
// place shipping price/estimate math happens — controllers, cart
// service, and seller/admin previews all call through here so
// nothing recomputes the logic independently.
const getShippingOptionsForSeller = async (sellerId, zone, subtotal) => {
  const settings = await prisma.sellerShippingSettings.findUnique({ where: { sellerId } });
  const processingMinDays = settings?.processingMinDays ?? 1;
  const processingMaxDays = settings?.processingMaxDays ?? 2;
  const sellerFreeThreshold = settings?.freeShippingThreshold ? Number(settings.freeShippingThreshold) : null;

  let rates = await prisma.shippingRate.findMany({
    where: { sellerId, zone, isActive: true, method: { isActive: true } },
    include: { method: true },
    orderBy: { method: { sortOrder: 'asc' } },
  });

  // Fallback to platform-default rates (sellerId: null) if this
  // seller hasn't configured shipping for this zone yet — prevents a
  // seller's cart items from being unshippable purely due to missing
  // configuration, per spec's "safe fallback" requirement.
  let usedFallback = false;
  if (rates.length === 0) {
    rates = await prisma.shippingRate.findMany({
      where: { sellerId: null, zone, isActive: true, method: { isActive: true } },
      include: { method: true },
      orderBy: { method: { sortOrder: 'asc' } },
    });
    usedFallback = true;
  }

  return rates.map((rate) => {
    const threshold = rate.freeShippingThreshold !== null ? Number(rate.freeShippingThreshold) : sellerFreeThreshold;
    const isFree = threshold !== null && subtotal >= threshold;
    const price = isFree ? 0 : Number(rate.flatRate);

    return {
      shippingMethodId: rate.method.id,
      code: rate.method.code,
      name: rate.method.name,
      description: rate.method.description,
      price: Math.round(price * 100) / 100,
      currency: 'USD',
      isFree,
      minDays: rate.method.deliveryMinDays + processingMinDays,
      maxDays: rate.method.deliveryMaxDays + processingMaxDays,
      usedFallbackRate: usedFallback,
    };
  });
};

module.exports = { resolveZoneFromState, getShippingOptionsForSeller };