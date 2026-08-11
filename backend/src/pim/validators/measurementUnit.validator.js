const PIM = require('../constants/pim.constants');

const validateMeasurementUnitInput = (input = {}, { isUpdate = false } = {}) => {
  const errors = [];
  const data = {};

  const name = input.name !== undefined ? input.name.trim() : undefined;
  if (!isUpdate || name !== undefined) {
    if (!name) errors.push({ field: 'name', message: 'Name is required' });
    else data.name = name;
  }

  const code = input.code !== undefined ? input.code.trim().toUpperCase() : undefined;
  if (!isUpdate || code !== undefined) {
    if (!code) errors.push({ field: 'code', message: 'Code is required, e.g. KG, CM' });
    else data.code = code;
  }

  if (input.unitType !== undefined) {
    if (!PIM.UNIT_TYPES.includes(input.unitType)) errors.push({ field: 'unitType', message: 'Invalid unit type' });
    else data.unitType = input.unitType;
  } else if (!isUpdate) {
    errors.push({ field: 'unitType', message: 'unitType is required' });
  }

  if (input.isActive !== undefined) data.isActive = input.isActive === true || input.isActive === 'true';

  return { isValid: errors.length === 0, errors, data };
};

module.exports = { validateMeasurementUnitInput };