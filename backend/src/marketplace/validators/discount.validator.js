const { DISCOUNT } = require('../constants/marketplace.constants');
const DiscountType = require('../enums/discountType.enum');

const isValidDiscount = ({ type, value }) => {
  if (!Object.values(DiscountType).includes(type)) return false;
  const num = Number(value);
  if (isNaN(num) || num <= 0) return false;

  if (type === DiscountType.PERCENTAGE) {
    return num >= DISCOUNT.MIN_PERCENTAGE && num <= DISCOUNT.MAX_PERCENTAGE;
  }
  return true; // fixed-amount validated against order total at the point of use, not here
};

module.exports = { isValidDiscount };