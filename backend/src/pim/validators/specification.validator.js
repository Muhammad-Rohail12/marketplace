const PIM = require('../constants/pim.constants');

const validateSpecTemplateInput = (input = {}, { isUpdate = false } = {}) => {
  const errors = [];
  const data = {};

  const name = input.name !== undefined ? input.name.trim() : undefined;
  if (!isUpdate || name !== undefined) {
    if (!name) errors.push({ field: 'name', message: 'Name is required' });
    else data.name = name;
  }

  if (input.categoryId !== undefined) {
    data.categoryId = input.categoryId === null || input.categoryId === '' ? null : parseInt(input.categoryId, 10);
  }

  if (input.isActive !== undefined) data.isActive = input.isActive === true || input.isActive === 'true';

  return { isValid: errors.length === 0, errors, data };
};

const validateSpecTemplateItemInput = (input = {}) => {
  const errors = [];
  const data = {};

  const label = (input.label || '').trim();
  if (!label) errors.push({ field: 'label', message: 'Label is required' });
  else data.label = label;

  if (input.group && !PIM.SPEC_GROUPS.includes(input.group)) {
    errors.push({ field: 'group', message: 'Invalid group' });
  } else {
    data.group = input.group || 'GENERAL';
  }

  data.attributeId = input.attributeId ? parseInt(input.attributeId, 10) : null;
  data.displayOrder = parseInt(input.displayOrder, 10) || 0;

  return { isValid: errors.length === 0, errors, data };
};

module.exports = { validateSpecTemplateInput, validateSpecTemplateItemInput };