const LIMITS = require('../constants/inventory.constants').LIMITS;
const { SELLER_TRIGGERABLE_TYPES } = require('../constants/inventory.constants');

const validateCreateInventoryInput = (input = {}) => {
  const errors = [];
  const data = {};

  const quantity = parseInt(input.quantity, 10);
  if (isNaN(quantity) || quantity < 0) {
    errors.push({ field: 'quantity', message: 'Initial quantity must be a non-negative integer' });
  } else if (quantity > LIMITS.MAX_INITIAL_STOCK) {
    errors.push({ field: 'quantity', message: `Initial quantity cannot exceed ${LIMITS.MAX_INITIAL_STOCK}` });
  } else {
    data.quantity = quantity;
  }

  if (input.variantId !== undefined) {
    data.variantId = input.variantId === null || input.variantId === '' ? null : parseInt(input.variantId, 10);
  }

  if (input.lowStockThreshold !== undefined) {
    const t = parseInt(input.lowStockThreshold, 10);
    if (isNaN(t) || t < 0 || t > LIMITS.MAX_THRESHOLD) errors.push({ field: 'lowStockThreshold', message: 'Invalid threshold' });
    else data.lowStockThreshold = t;
  }

  if (input.reorderPoint !== undefined) {
    const r = parseInt(input.reorderPoint, 10);
    if (isNaN(r) || r < 0) errors.push({ field: 'reorderPoint', message: 'Invalid reorder point' });
    else data.reorderPoint = r;
  }

  if (input.allowBackorder !== undefined) {
    data.allowBackorder = input.allowBackorder === true || input.allowBackorder === 'true';
  }

  if (input.sku !== undefined) data.sku = (input.sku || '').trim().slice(0, 40) || null;

  return { isValid: errors.length === 0, errors, data };
};

const validateAdjustmentInput = (input = {}, { requireReason = true } = {}) => {
  const errors = [];
  const data = {};

  const quantity = parseInt(input.quantity, 10);
  if (isNaN(quantity) || quantity === 0) {
    errors.push({ field: 'quantity', message: 'Adjustment quantity must be a non-zero integer (positive or negative)' });
  } else if (Math.abs(quantity) > LIMITS.MAX_ADJUSTMENT_MAGNITUDE) {
    errors.push({ field: 'quantity', message: `Adjustment magnitude cannot exceed ${LIMITS.MAX_ADJUSTMENT_MAGNITUDE}` });
  } else {
    data.quantity = quantity;
  }

  const type = input.type || 'MANUAL_ADJUSTMENT';
  if (!SELLER_TRIGGERABLE_TYPES.includes(type)) {
    errors.push({ field: 'type', message: 'Invalid or disallowed movement type for this action' });
  } else {
    data.type = type;
  }

  const reason = (input.reason || '').trim();
  if (requireReason && !reason) {
    errors.push({ field: 'reason', message: 'A reason is required for manual stock adjustments' });
  } else if (reason.length > LIMITS.REASON_MAX_LENGTH) {
    errors.push({ field: 'reason', message: `Reason must be under ${LIMITS.REASON_MAX_LENGTH} characters` });
  } else {
    data.reason = reason || null;
  }

  return { isValid: errors.length === 0, errors, data };
};

const validateRestockInput = (input = {}) => {
  const errors = [];
  const data = {};

  const quantity = parseInt(input.quantity, 10);
  if (isNaN(quantity) || quantity <= 0) {
    errors.push({ field: 'quantity', message: 'Restock quantity must be a positive integer' });
  } else if (quantity > LIMITS.MAX_ADJUSTMENT_MAGNITUDE) {
    errors.push({ field: 'quantity', message: `Restock quantity cannot exceed ${LIMITS.MAX_ADJUSTMENT_MAGNITUDE}` });
  } else {
    data.quantity = quantity;
  }

  data.reason = (input.reason || '').trim().slice(0, LIMITS.REASON_MAX_LENGTH) || 'Restock';

  return { isValid: errors.length === 0, errors, data };
};

const validateThresholdInput = (input = {}) => {
  const errors = [];
  const data = {};

  if (input.lowStockThreshold !== undefined) {
    const t = parseInt(input.lowStockThreshold, 10);
    if (isNaN(t) || t < 0 || t > LIMITS.MAX_THRESHOLD) errors.push({ field: 'lowStockThreshold', message: 'Invalid threshold' });
    else data.lowStockThreshold = t;
  }
  if (input.reorderPoint !== undefined) {
    const r = parseInt(input.reorderPoint, 10);
    if (isNaN(r) || r < 0) errors.push({ field: 'reorderPoint', message: 'Invalid reorder point' });
    else data.reorderPoint = r;
  }
  if (input.allowBackorder !== undefined) {
    data.allowBackorder = input.allowBackorder === true || input.allowBackorder === 'true';
  }

  return { isValid: errors.length === 0, errors, data };
};

module.exports = { validateCreateInventoryInput, validateAdjustmentInput, validateRestockInput, validateThresholdInput };