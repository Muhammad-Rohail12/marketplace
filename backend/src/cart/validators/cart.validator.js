const { LIMITS } = require('../constants/cart.constants');

const validateAddItemInput = (input = {}) => {
  const errors = [];
  const data = {};

  const productId = parseInt(input.productId, 10);
  if (isNaN(productId) || productId <= 0) {
    errors.push({ field: 'productId', message: 'A valid productId is required' });
  } else {
    data.productId = productId;
  }

  if (input.variantId !== undefined && input.variantId !== null && input.variantId !== '') {
    const variantId = parseInt(input.variantId, 10);
    if (isNaN(variantId) || variantId <= 0) {
      errors.push({ field: 'variantId', message: 'Invalid variantId' });
    } else {
      data.variantId = variantId;
    }
  } else {
    data.variantId = null;
  }

  const quantity = input.quantity === undefined ? 1 : Number(input.quantity);
  if (!Number.isInteger(quantity) || quantity <= 0) {
    errors.push({ field: 'quantity', message: 'Quantity must be a positive whole number' });
  } else if (quantity > LIMITS.MAX_QUANTITY_PER_LINE) {
    errors.push({ field: 'quantity', message: `Quantity cannot exceed ${LIMITS.MAX_QUANTITY_PER_LINE}` });
  } else {
    data.quantity = quantity;
  }

  return { isValid: errors.length === 0, errors, data };
};

const validateUpdateQuantityInput = (input = {}) => {
  const errors = [];
  const quantity = Number(input.quantity);

  if (!Number.isInteger(quantity) || quantity <= 0) {
    errors.push({ field: 'quantity', message: 'Quantity must be a positive whole number' });
  } else if (quantity > LIMITS.MAX_QUANTITY_PER_LINE) {
    errors.push({ field: 'quantity', message: `Quantity cannot exceed ${LIMITS.MAX_QUANTITY_PER_LINE}` });
  }

  return { isValid: errors.length === 0, errors, data: { quantity } };
};

module.exports = { validateAddItemInput, validateUpdateQuantityInput };