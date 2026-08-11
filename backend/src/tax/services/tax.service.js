const prisma = require('../../database/prismaClient');
const { FALLBACK_RATE } = require('../constants/tax.constants');

// Single source of truth for tax calculation — state-level flat rate
// applied to (itemsSubtotal - discountTotal). Shipping is NOT taxed
// in this phase (documented simplification; many US states do tax
// shipping, but jurisdiction-specific shipping-taxability rules are
// out of scope here).
const getStateTaxRate = async (stateCode) => {
  const row = await prisma.stateTaxRate.findUnique({ where: { stateCode: (stateCode || '').toUpperCase() } });
  if (!row || !row.isActive) return FALLBACK_RATE;
  return Number(row.rate);
};

const calculateTax = (taxableAmount, rate) => {
  const cents = Math.round(taxableAmount * 100);
  const taxCents = Math.round(cents * rate);
  return Math.round(taxCents) / 100;
};

module.exports = { getStateTaxRate, calculateTax };