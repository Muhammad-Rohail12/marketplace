const { LIMITS } = require('../constants/shipping.constants');

const validateShippingMethodInput = (input = {}, { isCreate = false } = {}) => {
  const errors = [];
  const data = {};

  if (isCreate || input.code !== undefined) {
    const code = (input.code || '').trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    if (!code) errors.push({ field: 'code', message: 'Code is required' });
    else if (code.length > LIMITS.CODE_MAX) errors.push({ field: 'code', message: 'Code too long' });
    else data.code = code;
  }

  if (isCreate || input.name !== undefined) {
    const name = (input.name || '').trim();
    if (!name) errors.push({ field: 'name', message: 'Name is required' });
    else if (name.length > LIMITS.NAME_MAX) errors.push({ field: 'name', message: 'Name too long' });
    else data.name = name;
  }

  if (input.description !== undefined) {
    const val = (input.description || '').trim();
    if (val.length > LIMITS.DESCRIPTION_MAX) errors.push({ field: 'description', message: 'Description too long' });
    else data.description = val || null;
  }

  const minDays = isCreate || input.deliveryMinDays !== undefined ? Number(input.deliveryMinDays) : undefined;
  const maxDays = isCreate || input.deliveryMaxDays !== undefined ? Number(input.deliveryMaxDays) : undefined;

  if (minDays !== undefined) {
    if (!Number.isInteger(minDays) || minDays < 0 || minDays > LIMITS.MIN_DAYS_MAX) errors.push({ field: 'deliveryMinDays', message: 'Invalid delivery min days' });
    else data.deliveryMinDays = minDays;
  }
  if (maxDays !== undefined) {
    if (!Number.isInteger(maxDays) || maxDays < 0 || maxDays > LIMITS.MIN_DAYS_MAX) errors.push({ field: 'deliveryMaxDays', message: 'Invalid delivery max days' });
    else data.deliveryMaxDays = maxDays;
  }
  if (data.deliveryMinDays !== undefined && data.deliveryMaxDays !== undefined && data.deliveryMaxDays < data.deliveryMinDays) {
    errors.push({ field: 'deliveryMaxDays', message: 'Max days must be >= min days' });
  }

  if (input.isActive !== undefined) data.isActive = input.isActive === true || input.isActive === 'true';
  if (input.sortOrder !== undefined) data.sortOrder = parseInt(input.sortOrder, 10) || 0;

  return { isValid: errors.length === 0, errors, data };
};

module.exports = { validateShippingMethodInput };