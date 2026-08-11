const LIMITS = require('../constants/product.constants').FIELD_LIMITS;
const { VISIBILITY, PRODUCT_TYPE, CONDITION } = require('../constants/product.constants');

const validateProductInput = (input = {}, { isCreate = false } = {}) => {
  const errors = [];
  const data = {};

  const name = input.name !== undefined ? input.name.trim() : undefined;
  if (isCreate || name !== undefined) {
    if (!name) errors.push({ field: 'name', message: 'Product name is required' });
    else if (name.length < LIMITS.NAME_MIN || name.length > LIMITS.NAME_MAX) {
      errors.push({ field: 'name', message: `Name must be ${LIMITS.NAME_MIN}-${LIMITS.NAME_MAX} characters` });
    } else data.name = name;
  }

  if (isCreate || input.categoryId !== undefined) {
    const categoryId = parseInt(input.categoryId, 10);
    if (isNaN(categoryId)) errors.push({ field: 'categoryId', message: 'A valid category is required' });
    else data.categoryId = categoryId;
  }

  if (input.brandId !== undefined) {
    data.brandId = input.brandId === null || input.brandId === '' ? null : parseInt(input.brandId, 10);
  }

  if (input.shortDescription !== undefined) {
    const val = (input.shortDescription || '').trim();
    if (val.length > LIMITS.SHORT_DESCRIPTION_MAX) errors.push({ field: 'shortDescription', message: `Must be under ${LIMITS.SHORT_DESCRIPTION_MAX} characters` });
    else data.shortDescription = val || null;
  }

  if (input.description !== undefined) {
    const val = (input.description || '').trim();
    if (val.length > LIMITS.DESCRIPTION_MAX) errors.push({ field: 'description', message: `Must be under ${LIMITS.DESCRIPTION_MAX} characters` });
    else data.description = val || null;
  }

  if (input.productType !== undefined) {
    if (!Object.values(PRODUCT_TYPE).includes(input.productType)) errors.push({ field: 'productType', message: 'Invalid product type' });
    else data.productType = input.productType;
  }

  if (input.condition !== undefined) {
    if (!Object.values(CONDITION).includes(input.condition)) errors.push({ field: 'condition', message: 'Invalid condition' });
    else data.condition = input.condition;
  }

  if (input.visibility !== undefined) {
    if (!Object.values(VISIBILITY).includes(input.visibility)) errors.push({ field: 'visibility', message: 'Invalid visibility' });
    else data.visibility = input.visibility;
  }

  [
    ['sku', LIMITS.SKU_MAX],
    ['barcode', LIMITS.BARCODE_MAX],
    ['modelNumber', LIMITS.MODEL_NUMBER_MAX],
    ['manufacturer', LIMITS.MANUFACTURER_MAX],
    ['countryOfOrigin', LIMITS.COUNTRY_MAX],
    ['warrantyInformation', LIMITS.WARRANTY_MAX],
    ['seoTitle', LIMITS.SEO_TITLE_MAX],
    ['seoDescription', LIMITS.SEO_DESCRIPTION_MAX],
    ['seoKeywords', LIMITS.SEO_KEYWORDS_MAX],
  ].forEach(([key, maxLen]) => {
    if (input[key] !== undefined) {
      const val = (input[key] || '').trim();
      if (val.length > maxLen) errors.push({ field: key, message: `Must be under ${maxLen} characters` });
      else data[key] = val || null;
    }
  });

  ['weight', 'length', 'width', 'height'].forEach((key) => {
    if (input[key] !== undefined) {
      const parsed = input[key] === '' || input[key] === null ? null : parseFloat(input[key]);
      if (parsed !== null && isNaN(parsed)) errors.push({ field: key, message: `${key} must be a number` });
      else data[key] = parsed;
    }
  });
  if (input.weightUnit !== undefined) data.weightUnit = input.weightUnit || null;
  if (input.dimensionUnit !== undefined) data.dimensionUnit = input.dimensionUnit || null;

  return { isValid: errors.length === 0, errors, data };
};

const validateAttributeValuesInput = (input = {}) => {
  const values = Array.isArray(input.attributeValues) ? input.attributeValues : [];
  const cleaned = values
    .map((v) => ({
      attributeId: parseInt(v.attributeId, 10),
      attributeValueId: v.attributeValueId ? parseInt(v.attributeValueId, 10) : null,
      value: v.value !== undefined && v.value !== null ? String(v.value).slice(0, 1000) : null,
    }))
    .filter((v) => !isNaN(v.attributeId));

  return { isValid: true, errors: [], data: cleaned };
};

const validateSpecificationsInput = (input = {}) => {
  const errors = [];
  const specs = Array.isArray(input.specifications) ? input.specifications : [];
  const cleaned = [];

  specs.forEach((s, i) => {
    const label = (s.label || '').trim();
    const value = (s.value || '').trim();
    if (!label || !value) {
      errors.push({ field: `specifications[${i}]`, message: 'Both label and value are required' });
      return;
    }
    cleaned.push({
      label: label.slice(0, 100),
      value: value.slice(0, 1000),
      group: ['GENERAL', 'TECHNICAL'].includes(s.group) ? s.group : 'GENERAL',
      displayOrder: parseInt(s.displayOrder, 10) || 0,
    });
  });

  return { isValid: errors.length === 0, errors, data: cleaned };
};

const validateVariantCombinationInput = (input = {}) => {
  const errors = [];
  const data = {};

  const name = (input.name || '').trim();
  if (!name) errors.push({ field: 'name', message: 'Variant name is required' });
  else data.name = name;

  if (input.sku !== undefined) data.sku = (input.sku || '').trim() || null;
  if (input.barcode !== undefined) data.barcode = (input.barcode || '').trim() || null;
  if (input.price !== undefined) {
    const parsed = input.price === '' ? null : parseFloat(input.price);
    if (parsed !== null && isNaN(parsed)) errors.push({ field: 'price', message: 'Price must be a number' });
    else data.price = parsed;
  }
  ['weight', 'length', 'width', 'height'].forEach((key) => {
    if (input[key] !== undefined) {
      const parsed = input[key] === '' ? null : parseFloat(input[key]);
      if (parsed !== null && isNaN(parsed)) errors.push({ field: key, message: `${key} must be a number` });
      else data[key] = parsed;
    }
  });

  const optionIds = Array.isArray(input.variantOptionIds)
    ? input.variantOptionIds.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id))
    : [];

  return { isValid: errors.length === 0, errors, data, optionIds };
};

const validateRejectionInput = (input = {}) => {
  const reason = (input.rejectionReason || '').trim();
  if (!reason) return { isValid: false, errors: [{ field: 'rejectionReason', message: 'A rejection reason is required' }], data: {} };
  return { isValid: true, errors: [], data: { rejectionReason: reason.slice(0, 1000) } };
};

module.exports = {
  validateProductInput,
  validateAttributeValuesInput,
  validateSpecificationsInput,
  validateVariantCombinationInput,
  validateRejectionInput,
};