const { LABELS, LIMITS, ZIP_REGEX, PHONE_REGEX, DEFAULT_COUNTRY_CODE } = require('../constants/address.constants');
const { US_STATE_CODES, getStateName } = require('../constants/usStates.constants');

// Strips any HTML/script-like content from free-text fields —
// delivery instructions in particular must never be rendered as raw
// HTML anywhere, but we also sanitize at write time as defense in depth.
const stripTags = (value = '') => value.replace(/<[^>]*>/g, '');

// Explicit allow-list only — mirrors the spec's explicit mass-
// assignment warning. req.body is NEVER spread directly into a
// Prisma call anywhere in this module.
const validateAddressInput = (input = {}, { isCreate = false } = {}) => {
  const errors = [];
  const data = {};

  const req = (key, maxLen) => {
    if (isCreate || input[key] !== undefined) {
      const val = stripTags((input[key] || '').trim());
      if (!val) errors.push({ field: key, message: `${key} is required` });
      else if (val.length > maxLen) errors.push({ field: key, message: `${key} must be under ${maxLen} characters` });
      else data[key] = val;
    }
  };

  req('firstName', LIMITS.NAME_MAX);
  req('lastName', LIMITS.NAME_MAX);
  req('addressLine1', LIMITS.ADDRESS_LINE_MAX);
  req('city', LIMITS.CITY_MAX);

  if (input.companyName !== undefined) {
    const val = stripTags((input.companyName || '').trim());
    if (val.length > LIMITS.COMPANY_MAX) errors.push({ field: 'companyName', message: 'Company name too long' });
    else data.companyName = val || null;
  }

  if (input.addressLine2 !== undefined) {
    const val = stripTags((input.addressLine2 || '').trim());
    if (val.length > LIMITS.ADDRESS_LINE_MAX) errors.push({ field: 'addressLine2', message: 'Address line 2 too long' });
    else data.addressLine2 = val || null;
  }

  if (isCreate || input.stateCode !== undefined) {
    const code = (input.stateCode || '').trim().toUpperCase();
    if (!US_STATE_CODES.includes(code)) {
      errors.push({ field: 'stateCode', message: 'Select a valid US state' });
    } else {
      data.stateCode = code;
      data.stateName = getStateName(code);
    }
  }

  if (isCreate || input.postalCode !== undefined) {
    const zip = (input.postalCode || '').trim();
    if (!ZIP_REGEX.test(zip)) {
      errors.push({ field: 'postalCode', message: 'Enter a valid ZIP code (12345 or 12345-6789)' });
    } else {
      data.postalCode = zip;
    }
  }

  // countryCode is accepted but pinned to US for this phase per the
  // USA Master Requirement — architecture stays extensible (the
  // column and constant exist), but no other country is accepted yet.
  if (input.countryCode !== undefined) {
    const code = (input.countryCode || DEFAULT_COUNTRY_CODE).trim().toUpperCase();
    if (code !== DEFAULT_COUNTRY_CODE) {
      errors.push({ field: 'countryCode', message: 'Only US addresses are currently supported' });
    } else {
      data.countryCode = DEFAULT_COUNTRY_CODE;
    }
  } else if (isCreate) {
    data.countryCode = DEFAULT_COUNTRY_CODE;
  }

  if (isCreate || input.phone !== undefined) {
    const phone = (input.phone || '').trim();
    if (!PHONE_REGEX.test(phone)) {
      errors.push({ field: 'phone', message: 'Enter a valid US phone number' });
    } else {
      // Normalize to a consistent canonical form: +1XXXXXXXXXX
      const digits = phone.replace(/\D/g, '').replace(/^1/, '');
      data.phone = `+1${digits}`;
    }
  }

  if (input.deliveryInstructions !== undefined) {
    const val = stripTags((input.deliveryInstructions || '').trim());
    if (val.length > LIMITS.INSTRUCTIONS_MAX) {
      errors.push({ field: 'deliveryInstructions', message: `Must be under ${LIMITS.INSTRUCTIONS_MAX} characters` });
    } else {
      data.deliveryInstructions = val || null;
    }
  }

  if (input.label !== undefined) {
    if (!LABELS.includes(input.label)) errors.push({ field: 'label', message: 'Invalid address label' });
    else data.label = input.label;
  } else if (isCreate) {
    data.label = 'HOME';
  }

  if (input.isDefault !== undefined) {
    data.isDefault = input.isDefault === true || input.isDefault === 'true';
  }

  // userId, id, createdAt, updatedAt, deletedAt are intentionally
  // NEVER read from input here — ownership is always derived from
  // req.user.id in the service layer, never from the request body.

  return { isValid: errors.length === 0, errors, data };
};

const validateSelectAddressInput = (input = {}) => {
  const addressId = parseInt(input.addressId, 10);
  if (isNaN(addressId) || addressId <= 0) {
    return { isValid: false, errors: [{ field: 'addressId', message: 'A valid addressId is required' }], data: {} };
  }
  return { isValid: true, errors: [], data: { addressId } };
};

module.exports = { validateAddressInput, validateSelectAddressInput };