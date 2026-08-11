const { SUPPORTED_CURRENCIES, DISCOUNT_TYPE, LIMITS } = require('../constants/pricing.constants');

const isValidMoney = (value) => {
  const n = Number(value);
  return !isNaN(n) && isFinite(n) && n >= 0 && n <= LIMITS.MAX_PRICE;
};

const validatePriceInput = (input = {}, { isCreate = false } = {}) => {
  const errors = [];
  const data = {};

  if (isCreate || input.basePrice !== undefined) {
    if (!isValidMoney(input.basePrice)) {
      errors.push({ field: 'basePrice', message: 'Base price must be a valid non-negative number' });
    } else {
      data.basePrice = Number(input.basePrice);
    }
  }

  if (input.compareAtPrice !== undefined) {
    if (input.compareAtPrice === null || input.compareAtPrice === '') {
      data.compareAtPrice = null;
    } else if (!isValidMoney(input.compareAtPrice)) {
      errors.push({ field: 'compareAtPrice', message: 'Compare-at price must be a valid non-negative number' });
    } else {
      data.compareAtPrice = Number(input.compareAtPrice);
    }
  }

  // compareAtPrice must be >= basePrice (it's the crossed-out
  // "original" price shown above the current price) — checked here
  // when both are present in this request; cross-field checks against
  // an existing DB value happen in the service layer.
  if (data.basePrice !== undefined && data.compareAtPrice !== undefined && data.compareAtPrice !== null) {
    if (data.compareAtPrice < data.basePrice) {
      errors.push({ field: 'compareAtPrice', message: 'Compare-at price must be greater than or equal to the base price' });
    }
  }

  if (input.costPrice !== undefined) {
    if (input.costPrice === null || input.costPrice === '') {
      data.costPrice = null;
    } else if (!isValidMoney(input.costPrice)) {
      errors.push({ field: 'costPrice', message: 'Cost price must be a valid non-negative number' });
    } else {
      data.costPrice = Number(input.costPrice);
    }
  }

  if (input.minimumPrice !== undefined) {
    data.minimumPrice = input.minimumPrice === null || input.minimumPrice === '' ? null : Number(input.minimumPrice);
  }
  if (input.maximumPrice !== undefined) {
    data.maximumPrice = input.maximumPrice === null || input.maximumPrice === '' ? null : Number(input.maximumPrice);
  }

  if (input.currency !== undefined) {
    if (!SUPPORTED_CURRENCIES.includes(input.currency)) {
      errors.push({ field: 'currency', message: `Currency must be one of: ${SUPPORTED_CURRENCIES.join(', ')}` });
    } else {
      data.currency = input.currency;
    }
  }

  if (input.variantId !== undefined) {
    data.variantId = input.variantId === null || input.variantId === '' ? null : parseInt(input.variantId, 10);
  }

  return { isValid: errors.length === 0, errors, data };
};

const validateDiscountInput = (input = {}, { isCreate = false } = {}) => {
  const errors = [];
  const data = {};

  if (isCreate || input.type !== undefined) {
    if (!Object.values(DISCOUNT_TYPE).includes(input.type)) {
      errors.push({ field: 'type', message: 'Discount type must be PERCENTAGE or FIXED_AMOUNT' });
    } else {
      data.type = input.type;
    }
  }

  if (isCreate || input.value !== undefined) {
    const value = Number(input.value);
    if (isNaN(value) || value <= 0) {
      errors.push({ field: 'value', message: 'Discount value must be a positive number' });
    } else if (data.type === DISCOUNT_TYPE.PERCENTAGE && value > LIMITS.MAX_PERCENTAGE) {
      errors.push({ field: 'value', message: `Percentage discount cannot exceed ${LIMITS.MAX_PERCENTAGE}%` });
    } else if (data.type === DISCOUNT_TYPE.FIXED_AMOUNT && value > LIMITS.MAX_FIXED_DISCOUNT) {
      errors.push({ field: 'value', message: 'Fixed discount amount exceeds the allowed maximum' });
    } else {
      data.value = value;
    }
  }

  if (input.startAt !== undefined) {
    data.startAt = input.startAt ? new Date(input.startAt) : null;
    if (data.startAt && isNaN(data.startAt.getTime())) errors.push({ field: 'startAt', message: 'Invalid start date' });
  }
  if (input.endAt !== undefined) {
    data.endAt = input.endAt ? new Date(input.endAt) : null;
    if (data.endAt && isNaN(data.endAt.getTime())) errors.push({ field: 'endAt', message: 'Invalid end date' });
  }
  if (data.startAt && data.endAt && data.endAt <= data.startAt) {
    errors.push({ field: 'endAt', message: 'End date must be after start date' });
  }

  if (input.variantId !== undefined) {
    data.variantId = input.variantId === null || input.variantId === '' ? null : parseInt(input.variantId, 10);
  }
  if (input.isEnabled !== undefined) data.isEnabled = input.isEnabled === true || input.isEnabled === 'true';
  if (input.maxUses !== undefined) data.maxUses = input.maxUses === null || input.maxUses === '' ? null : parseInt(input.maxUses, 10);
  if (input.minimumQuantity !== undefined) data.minimumQuantity = input.minimumQuantity === null || input.minimumQuantity === '' ? null : parseInt(input.minimumQuantity, 10);
  if (input.maximumQuantity !== undefined) data.maximumQuantity = input.maximumQuantity === null || input.maximumQuantity === '' ? null : parseInt(input.maximumQuantity, 10);

  return { isValid: errors.length === 0, errors, data };
};

const validateDealInput = (input = {}, { isCreate = false } = {}) => {
  const errors = [];
  const data = {};

  const name = input.name !== undefined ? input.name.trim() : undefined;
  if (isCreate || name !== undefined) {
    if (!name) errors.push({ field: 'name', message: 'Deal name is required' });
    else if (name.length > LIMITS.NAME_MAX_LENGTH) errors.push({ field: 'name', message: 'Name too long' });
    else data.name = name;
  }

  if (input.description !== undefined) {
    const val = (input.description || '').trim();
    if (val.length > LIMITS.DESCRIPTION_MAX_LENGTH) errors.push({ field: 'description', message: 'Description too long' });
    else data.description = val || null;
  }

  if (isCreate || input.startAt !== undefined) {
    const startAt = new Date(input.startAt);
    if (isNaN(startAt.getTime())) errors.push({ field: 'startAt', message: 'Invalid start date' });
    else data.startAt = startAt;
  }
  if (isCreate || input.endAt !== undefined) {
    const endAt = new Date(input.endAt);
    if (isNaN(endAt.getTime())) errors.push({ field: 'endAt', message: 'Invalid end date' });
    else data.endAt = endAt;
  }
  if (data.startAt && data.endAt) {
    if (data.endAt <= data.startAt) {
      errors.push({ field: 'endAt', message: 'End date must be after start date' });
    } else {
      const days = (data.endAt - data.startAt) / (1000 * 60 * 60 * 24);
      if (days > LIMITS.MAX_DEAL_DURATION_DAYS) {
        errors.push({ field: 'endAt', message: `Deal duration cannot exceed ${LIMITS.MAX_DEAL_DURATION_DAYS} days` });
      }
    }
  }

  if (input.isEnabled !== undefined) data.isEnabled = input.isEnabled === true || input.isEnabled === 'true';

  return { isValid: errors.length === 0, errors, data };
};

const validateAdminAdjustmentInput = (input = {}) => {
  const errors = [];
  const reason = (input.reason || '').trim();
  if (!reason) errors.push({ field: 'reason', message: 'A reason is required for admin price adjustments' });
  return { isValid: errors.length === 0, errors, data: { reason: reason.slice(0, LIMITS.REASON_MAX_LENGTH) } };
};

module.exports = { validatePriceInput, validateDiscountInput, validateDealInput, validateAdminAdjustmentInput };