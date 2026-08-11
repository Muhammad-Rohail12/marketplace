const { isValidEmail, isValidPhone, isValidUrl } = require('../../utils/validation');
const { FIELD_LIMITS, POLICY_TYPES } = require('../constants/store.constants');

// Partial-update validator — mirrors Category/Brand pattern: only
// fields present in input are validated/returned, everything else
// is left untouched by the service layer's Prisma update.
const validateStoreUpdateInput = (input = {}) => {
  const errors = [];
  const data = {};

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) errors.push({ field: 'name', message: 'Store name cannot be empty' });
    else if (name.length > FIELD_LIMITS.NAME_MAX) errors.push({ field: 'name', message: `Must be under ${FIELD_LIMITS.NAME_MAX} characters` });
    else data.name = name;
  }

  if (input.shortDescription !== undefined) {
    const val = (input.shortDescription || '').trim();
    if (val.length > FIELD_LIMITS.SHORT_DESCRIPTION_MAX) {
      errors.push({ field: 'shortDescription', message: `Must be under ${FIELD_LIMITS.SHORT_DESCRIPTION_MAX} characters` });
    } else data.shortDescription = val || null;
  }

  if (input.description !== undefined) {
    const val = (input.description || '').trim();
    if (val.length > FIELD_LIMITS.DESCRIPTION_MAX) {
      errors.push({ field: 'description', message: `Must be under ${FIELD_LIMITS.DESCRIPTION_MAX} characters` });
    } else data.description = val || null;
  }

  if (input.email !== undefined) {
    const val = (input.email || '').trim().toLowerCase();
    if (val && !isValidEmail(val)) errors.push({ field: 'email', message: 'Enter a valid email address' });
    else data.email = val || null;
  }

  if (input.phone !== undefined) {
    const val = (input.phone || '').trim();
    if (val && !isValidPhone(val)) errors.push({ field: 'phone', message: 'Enter a valid phone number' });
    else data.phone = val || null;
  }

  if (input.website !== undefined) {
    const val = (input.website || '').trim();
    if (val && !isValidUrl(val)) errors.push({ field: 'website', message: 'Enter a valid URL (including https://)' });
    else data.website = val || null;
  }

  [
    ['country', FIELD_LIMITS.COUNTRY_MAX],
    ['stateProvince', FIELD_LIMITS.STATE_MAX],
    ['city', FIELD_LIMITS.CITY_MAX],
    ['address', FIELD_LIMITS.ADDRESS_MAX],
    ['postalCode', FIELD_LIMITS.POSTAL_CODE_MAX],
  ].forEach(([key, maxLen]) => {
    if (input[key] !== undefined) {
      const val = (input[key] || '').trim();
      if (val.length > maxLen) errors.push({ field: key, message: `Must be under ${maxLen} characters` });
      else data[key] = val || null;
    }
  });

  if (input.showContactInformation !== undefined) {
    data.showContactInformation = input.showContactInformation === true || input.showContactInformation === 'true';
  }

  if (input.seoTitle !== undefined) {
    const val = (input.seoTitle || '').trim();
    if (val.length > FIELD_LIMITS.SEO_TITLE_MAX) errors.push({ field: 'seoTitle', message: `Must be under ${FIELD_LIMITS.SEO_TITLE_MAX} characters` });
    else data.seoTitle = val || null;
  }

  if (input.seoDescription !== undefined) {
    const val = (input.seoDescription || '').trim();
    if (val.length > FIELD_LIMITS.SEO_DESCRIPTION_MAX) errors.push({ field: 'seoDescription', message: `Must be under ${FIELD_LIMITS.SEO_DESCRIPTION_MAX} characters` });
    else data.seoDescription = val || null;
  }

  // Sellers may never set slug or status through this endpoint —
  // silently ignored even if present in the request body, rather
  // than erroring, since a naive client might resend the full object
  // it received from GET /seller/store.

  return { isValid: errors.length === 0, errors, data };
};

const validatePoliciesInput = (input = {}) => {
  const errors = [];
  const policies = Array.isArray(input.policies) ? input.policies : [];

  if (!policies.length) {
    return { isValid: true, errors: [], data: [] };
  }

  const cleaned = [];
  policies.forEach((p, i) => {
    if (!POLICY_TYPES.includes(p.type)) {
      errors.push({ field: `policies[${i}].type`, message: 'Invalid policy type' });
      return;
    }
    const content = (p.content || '').trim();
    if (content.length > FIELD_LIMITS.POLICY_CONTENT_MAX) {
      errors.push({ field: `policies[${i}].content`, message: `Must be under ${FIELD_LIMITS.POLICY_CONTENT_MAX} characters` });
      return;
    }
    cleaned.push({ type: p.type, content });
  });

  return { isValid: errors.length === 0, errors, data: cleaned };
};

module.exports = { validateStoreUpdateInput, validatePoliciesInput };