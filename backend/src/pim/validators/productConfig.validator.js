const PIM = require('../constants/pim.constants');

const validateSkuConfigInput = (input = {}, { isUpdate = false } = {}) => {
  const errors = [];
  const data = {};

  const name = input.name !== undefined ? input.name.trim() : undefined;
  if (!isUpdate || name !== undefined) {
    if (!name) errors.push({ field: 'name', message: 'Name is required' });
    else data.name = name;
  }

  const pattern = input.pattern !== undefined ? input.pattern.trim() : undefined;
  if (!isUpdate || pattern !== undefined) {
    if (!pattern) errors.push({ field: 'pattern', message: 'Pattern is required, e.g. {CATEGORY}-{RANDOM}' });
    else data.pattern = pattern;
  }

  if (input.isActive !== undefined) data.isActive = input.isActive === true || input.isActive === 'true';

  return { isValid: errors.length === 0, errors, data };
};

const validateBarcodeConfigInput = (input = {}, { isUpdate = false } = {}) => {
  const errors = [];
  const data = {};

  const name = input.name !== undefined ? input.name.trim() : undefined;
  if (!isUpdate || name !== undefined) {
    if (!name) errors.push({ field: 'name', message: 'Name is required' });
    else data.name = name;
  }

  if (input.type !== undefined) {
    if (!PIM.BARCODE_TYPES.includes(input.type)) errors.push({ field: 'type', message: 'Invalid barcode type' });
    else data.type = input.type;
  } else if (!isUpdate) {
    errors.push({ field: 'type', message: 'Type is required' });
  }

  if (input.prefix !== undefined) data.prefix = (input.prefix || '').trim() || null;
  if (input.isActive !== undefined) data.isActive = input.isActive === true || input.isActive === 'true';

  return { isValid: errors.length === 0, errors, data };
};

module.exports = { validateSkuConfigInput, validateBarcodeConfigInput };