const { PRODUCT } = require('../constants/marketplace.constants');

const isValidPrice = (price) => {
  const num = Number(price);
  return !isNaN(num) && num >= PRODUCT.MIN_PRICE && num <= PRODUCT.MAX_PRICE;
};

module.exports = { isValidPrice };