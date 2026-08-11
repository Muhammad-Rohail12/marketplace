const PIM = require('../constants/pim.constants');

const validateVariantOptionInput = (input = {}) => {
  const errors = [];
  const attributeId = parseInt(input.attributeId, 10);
  const attributeValueId = parseInt(input.attributeValueId, 10);

  if (isNaN(attributeId)) errors.push({ field: 'attributeId', message: 'Valid attributeId is required' });
  if (isNaN(attributeValueId)) errors.push({ field: 'attributeValueId', message: 'Valid attributeValueId is required' });

  return { isValid: errors.length === 0, errors, data: { attributeId, attributeValueId } };
};

const validateVariantCombinationInput = (input = {}, { isUpdate = false } = {}) => {
  const errors = [];
  const data = {};

  const name = input.name !== undefined ? input.name.trim() : undefined;
  if (!isUpdate || name !== undefined) {
    if (!name) errors.push({ field: 'name', message: 'Name is required' });
    else data.name = name;
  }

  if (input.sku !== undefined) {
    const sku = (input.sku || '').trim();
    if (sku && !PIM.SKU_REGEX.test(sku)) {
      errors.push({ field: 'sku', message: 'SKU must be 3-40 alphanumeric characters or hyphens' });
    } else {
      data.sku = sku || null;
    }
  }

  if (input.barcode !== undefined) data.barcode = (input.barcode || '').trim() || null;

  ['weight', 'length', 'width', 'height'].forEach((key) => {
    if (input[key] !== undefined) {
      const parsed = input[key] === '' || input[key] === null ? null : parseFloat(input[key]);
      if (parsed !== null && isNaN(parsed)) {
        errors.push({ field: key, message: `${key} must be a number` });
      } else {
        data[key] = parsed;
      }
    }
  });

  if (input.weightUnit !== undefined) data.weightUnit = input.weightUnit || null;
  if (input.dimensionUnit !== undefined) data.dimensionUnit = input.dimensionUnit || null;
  if (input.status !== undefined) data.status = input.status;

  const optionIds = Array.isArray(input.variantOptionIds)
    ? input.variantOptionIds.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id))
    : [];

  return { isValid: errors.length === 0, errors, data, optionIds };
};

module.exports = { validateVariantOptionInput, validateVariantCombinationInput };