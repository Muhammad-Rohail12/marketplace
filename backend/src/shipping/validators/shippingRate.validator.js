const { ZONE_CODES, LIMITS } = require('../constants/shipping.constants');

const validateShippingRateInput = (input = {}, { isCreate = false } = {}) => {
  const errors = [];
  const data = {};

  if (isCreate || input.shippingMethodId !== undefined) {
    const id = parseInt(input.shippingMethodId, 10);
    if (isNaN(id)) errors.push({ field: 'shippingMethodId', message: 'A valid shipping method is required' });
    else data.shippingMethodId = id;
  }

  if (isCreate || input.zone !== undefined) {
    if (!ZONE_CODES.includes(input.zone)) errors.push({ field: 'zone', message: 'Invalid shipping zone' });
    else data.zone = input.zone;
  }

  if (isCreate || input.flatRate !== undefined) {
    const rate = Number(input.flatRate);
    if (isNaN(rate) || rate < 0 || rate > LIMITS.MAX_FLAT_RATE) errors.push({ field: 'flatRate', message: 'Invalid flat rate' });
    else data.flatRate = rate;
  }

  if (input.freeShippingThreshold !== undefined) {
    if (input.freeShippingThreshold === null || input.freeShippingThreshold === '') {
      data.freeShippingThreshold = null;
    } else {
      const val = Number(input.freeShippingThreshold);
      if (isNaN(val) || val < 0) errors.push({ field: 'freeShippingThreshold', message: 'Invalid free shipping threshold' });
      else data.freeShippingThreshold = val;
    }
  }

  if (input.isActive !== undefined) data.isActive = input.isActive === true || input.isActive === 'true';

  return { isValid: errors.length === 0, errors, data };
};

const validateSellerSettingsInput = (input = {}) => {
  const errors = [];
  const data = {};

  if (input.processingMinDays !== undefined) {
    const v = parseInt(input.processingMinDays, 10);
    if (isNaN(v) || v < 0) errors.push({ field: 'processingMinDays', message: 'Invalid value' });
    else data.processingMinDays = v;
  }
  if (input.processingMaxDays !== undefined) {
    const v = parseInt(input.processingMaxDays, 10);
    if (isNaN(v) || v < 0) errors.push({ field: 'processingMaxDays', message: 'Invalid value' });
    else data.processingMaxDays = v;
  }
  if (data.processingMinDays !== undefined && data.processingMaxDays !== undefined && data.processingMaxDays < data.processingMinDays) {
    errors.push({ field: 'processingMaxDays', message: 'Max must be >= min' });
  }
  if (input.freeShippingThreshold !== undefined) {
    if (input.freeShippingThreshold === null || input.freeShippingThreshold === '') {
      data.freeShippingThreshold = null;
    } else {
      const val = Number(input.freeShippingThreshold);
      if (isNaN(val) || val < 0) errors.push({ field: 'freeShippingThreshold', message: 'Invalid threshold' });
      else data.freeShippingThreshold = val;
    }
  }

  return { isValid: errors.length === 0, errors, data };
};

module.exports = { validateShippingRateInput, validateSellerSettingsInput };