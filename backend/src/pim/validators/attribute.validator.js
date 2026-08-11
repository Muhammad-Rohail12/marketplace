const PIM = require('../constants/pim.constants');
const { generateSlug } = require('../../marketplace').helpers.slug;

const validateAttributeGroupInput = (input = {}, { isUpdate = false } = {}) => {
  const errors = [];
  const data = {};

  const name = input.name !== undefined ? input.name.trim() : undefined;
  if (!isUpdate || name !== undefined) {
    if (!name) errors.push({ field: 'name', message: 'Name is required' });
    else if (name.length > PIM.NAME_MAX_LENGTH) errors.push({ field: 'name', message: 'Name too long' });
    else data.name = name;
  }

  if (input.displayOrder !== undefined) {
    const parsed = parseInt(input.displayOrder, 10);
    if (isNaN(parsed) || parsed < 0) errors.push({ field: 'displayOrder', message: 'Must be a non-negative integer' });
    else data.displayOrder = parsed;
  }

  if (input.isActive !== undefined) data.isActive = input.isActive === true || input.isActive === 'true';

  return { isValid: errors.length === 0, errors, data };
};

const validateAttributeInput = (input = {}, { isUpdate = false } = {}) => {
  const errors = [];
  const data = {};

  const name = input.name !== undefined ? input.name.trim() : undefined;
  if (!isUpdate || name !== undefined) {
    if (!name) errors.push({ field: 'name', message: 'Name is required' });
    else data.name = name;
  }

  if (!isUpdate) {
    data.code = generateSlug(input.code || name || '').replace(/-/g, '_');
    if (!data.code) errors.push({ field: 'code', message: 'Code could not be generated from name' });
  }

  if (input.type !== undefined) {
    if (!PIM.ATTRIBUTE_TYPES.includes(input.type)) errors.push({ field: 'type', message: 'Invalid attribute type' });
    else data.type = input.type;
  } else if (!isUpdate) {
    errors.push({ field: 'type', message: 'Type is required' });
  }

  if (input.unitType !== undefined) {
    if (input.unitType && !PIM.UNIT_TYPES.includes(input.unitType)) {
      errors.push({ field: 'unitType', message: 'Invalid unit type' });
    } else {
      data.unitType = input.unitType || null;
    }
  }

  if (input.groupId !== undefined) {
    data.groupId = input.groupId === null || input.groupId === '' ? null : parseInt(input.groupId, 10);
  }

  if (input.validationRules !== undefined) {
    if (input.validationRules) {
      try {
        JSON.parse(input.validationRules);
        data.validationRules = input.validationRules;
      } catch {
        errors.push({ field: 'validationRules', message: 'Must be valid JSON' });
      }
    } else {
      data.validationRules = null;
    }
  }

  if (input.displayOrder !== undefined) {
    const parsed = parseInt(input.displayOrder, 10);
    if (isNaN(parsed) || parsed < 0) errors.push({ field: 'displayOrder', message: 'Must be a non-negative integer' });
    else data.displayOrder = parsed;
  }

  ['isRequired', 'isVariantAttribute', 'isFilterable', 'isActive'].forEach((key) => {
    if (input[key] !== undefined) data[key] = input[key] === true || input[key] === 'true';
  });

  return { isValid: errors.length === 0, errors, data };
};

const validateAttributeValueInput = (input = {}, { isUpdate = false } = {}) => {
  const errors = [];
  const data = {};

  const value = input.value !== undefined ? input.value.trim() : undefined;
  if (!isUpdate || value !== undefined) {
    if (!value) errors.push({ field: 'value', message: 'Value is required' });
    else if (value.length > PIM.VALUE_MAX_LENGTH) errors.push({ field: 'value', message: 'Value too long' });
    else data.value = value;
  }

  const label = input.label !== undefined ? input.label.trim() : undefined;
  if (label !== undefined) data.label = label || value;
  else if (!isUpdate) data.label = value;

  if (input.colorHex !== undefined) {
    const colorHex = (input.colorHex || '').trim();
    if (colorHex && !/^#[0-9A-Fa-f]{6}$/.test(colorHex)) {
      errors.push({ field: 'colorHex', message: 'Must be a valid hex color, e.g. #FF0000' });
    } else {
      data.colorHex = colorHex || null;
    }
  }

  if (input.displayOrder !== undefined) {
    const parsed = parseInt(input.displayOrder, 10);
    if (isNaN(parsed) || parsed < 0) errors.push({ field: 'displayOrder', message: 'Must be a non-negative integer' });
    else data.displayOrder = parsed;
  }

  if (input.isActive !== undefined) data.isActive = input.isActive === true || input.isActive === 'true';

  return { isValid: errors.length === 0, errors, data };
};

const validateCategoryAttributeInput = (input = {}) => {
  const errors = [];
  const data = {};

  const categoryId = parseInt(input.categoryId, 10);
  const attributeId = parseInt(input.attributeId, 10);

  if (isNaN(categoryId)) errors.push({ field: 'categoryId', message: 'Valid categoryId is required' });
  else data.categoryId = categoryId;

  if (isNaN(attributeId)) errors.push({ field: 'attributeId', message: 'Valid attributeId is required' });
  else data.attributeId = attributeId;

  data.isRequired = input.isRequired === true || input.isRequired === 'true';
  data.displayOrder = parseInt(input.displayOrder, 10) || 0;

  return { isValid: errors.length === 0, errors, data };
};

module.exports = {
  validateAttributeGroupInput,
  validateAttributeInput,
  validateAttributeValueInput,
  validateCategoryAttributeInput,
};