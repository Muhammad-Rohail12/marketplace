const { SKU } = require('../constants/marketplace.constants');

const isValidSku = (sku = '') => {
  const trimmed = sku.trim();
  return trimmed.length >= SKU.MIN_LENGTH && trimmed.length <= SKU.MAX_LENGTH && /^[A-Za-z0-9-]+$/.test(trimmed);
};

module.exports = { isValidSku };