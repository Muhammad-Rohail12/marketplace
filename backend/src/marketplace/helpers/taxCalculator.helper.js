const { TAX } = require('../constants/marketplace.constants');

// Placeholder — always returns 0 tax until a real Tax phase defines
// jurisdiction-aware rates. Centralizing the call site now means
// checkout/order code can call this today and get real behavior
// later without changing its own logic.
const calculateTax = (subtotal) => {
  const rate = TAX.DEFAULT_RATE_PERCENTAGE / 100;
  return Math.round(subtotal * rate * 100) / 100;
};

module.exports = { calculateTax };