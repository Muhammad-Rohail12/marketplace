const validateSelectShippingInput = (input = {}) => {
  const errors = [];
  const storeId = parseInt(input.storeId, 10);
  const shippingMethodId = parseInt(input.shippingMethodId, 10);

  if (isNaN(storeId)) errors.push({ field: 'storeId', message: 'A valid storeId is required' });
  if (isNaN(shippingMethodId)) errors.push({ field: 'shippingMethodId', message: 'A valid shippingMethodId is required' });

  return { isValid: errors.length === 0, errors, data: { storeId, shippingMethodId } };
};

module.exports = { validateSelectShippingInput };