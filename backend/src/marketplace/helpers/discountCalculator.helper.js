const DiscountType = require('../enums/discountType.enum');

// Placeholder — wired up for real use once Coupons/Promotions exist.
const calculateDiscount = (amount, { type, value }) => {
  if (type === DiscountType.PERCENTAGE) {
    return Math.round(amount * (value / 100) * 100) / 100;
  }
  if (type === DiscountType.FIXED_AMOUNT) {
    return Math.min(value, amount);
  }
  return 0;
};

module.exports = { calculateDiscount };