const { isValidEmail, isValidPhone } = require('../../utils/validation');
const LIMITS = require('../constants/sellerApplication.constants').FIELD_LIMITS;

const validateApplicationInput = (input = {}, { isSubmit = false } = {}) => {
  const errors = [];
  const data = {};

  const fields = [
    ['businessName', LIMITS.BUSINESS_NAME_MAX, true],
    ['businessType', LIMITS.BUSINESS_TYPE_MAX, true],
    ['contactName', LIMITS.CONTACT_NAME_MAX, true],
    ['country', LIMITS.COUNTRY_MAX, true],
    ['stateProvince', LIMITS.STATE_MAX, true],
    ['city', LIMITS.CITY_MAX, true],
    ['address', LIMITS.ADDRESS_MAX, true],
    ['postalCode', LIMITS.POSTAL_CODE_MAX, true],
  ];

  fields.forEach(([key, maxLen, required]) => {
    if (input[key] !== undefined) {
      const val = (input[key] || '').trim();
      if (required && isSubmit && !val) {
        errors.push({ field: key, message: `${key} is required` });
      } else if (val.length > maxLen) {
        errors.push({ field: key, message: `${key} must be under ${maxLen} characters` });
      } else {
        data[key] = val || null;
      }
    } else if (required && isSubmit) {
      errors.push({ field: key, message: `${key} is required` });
    }
  });

  if (input.businessDescription !== undefined) {
    const desc = (input.businessDescription || '').trim();
    if (desc.length > LIMITS.DESCRIPTION_MAX) {
      errors.push({ field: 'businessDescription', message: `Must be under ${LIMITS.DESCRIPTION_MAX} characters` });
    } else {
      data.businessDescription = desc || null;
    }
  }

  if (input.contactEmail !== undefined) {
    const email = (input.contactEmail || '').trim().toLowerCase();
    if (isSubmit && !email) {
      errors.push({ field: 'contactEmail', message: 'Contact email is required' });
    } else if (email && !isValidEmail(email)) {
      errors.push({ field: 'contactEmail', message: 'Enter a valid email address' });
    } else {
      data.contactEmail = email || null;
    }
  } else if (isSubmit) {
    errors.push({ field: 'contactEmail', message: 'Contact email is required' });
  }

  if (input.contactPhone !== undefined) {
    const phone = (input.contactPhone || '').trim();
    if (isSubmit && !phone) {
      errors.push({ field: 'contactPhone', message: 'Contact phone is required' });
    } else if (phone && !isValidPhone(phone)) {
      errors.push({ field: 'contactPhone', message: 'Enter a valid phone number' });
    } else {
      data.contactPhone = phone || null;
    }
  } else if (isSubmit) {
    errors.push({ field: 'contactPhone', message: 'Contact phone is required' });
  }

  if (input.taxInformation !== undefined) {
    data.taxInformation = (input.taxInformation || '').trim().slice(0, LIMITS.TAX_INFO_MAX) || null;
  }
  if (input.businessRegistrationNumber !== undefined) {
    data.businessRegistrationNumber = (input.businessRegistrationNumber || '').trim().slice(0, LIMITS.REG_NUMBER_MAX) || null;
  }

  if (isSubmit) {
    const termsAccepted = input.termsAccepted === true || input.termsAccepted === 'true';
    if (!termsAccepted) {
      errors.push({ field: 'termsAccepted', message: 'You must accept the seller terms to submit' });
    } else {
      data.termsAccepted = true;
    }
  } else if (input.termsAccepted !== undefined) {
    data.termsAccepted = input.termsAccepted === true || input.termsAccepted === 'true';
  }

  return { isValid: errors.length === 0, errors, data };
};

const validateRejectionInput = (input = {}) => {
  const errors = [];
  const reason = (input.rejectionReason || '').trim();

  if (!reason) {
    errors.push({ field: 'rejectionReason', message: 'A rejection reason is required' });
  } else if (reason.length > LIMITS.REJECTION_REASON_MAX) {
    errors.push({ field: 'rejectionReason', message: `Must be under ${LIMITS.REJECTION_REASON_MAX} characters` });
  }

  return { isValid: errors.length === 0, errors, data: { rejectionReason: reason } };
};

const validateAdminNotesInput = (input = {}) => {
  const notes = (input.adminNotes || '').trim().slice(0, LIMITS.ADMIN_NOTES_MAX);
  return { isValid: true, errors: [], data: { adminNotes: notes || null } };
};

module.exports = { validateApplicationInput, validateRejectionInput, validateAdminNotesInput };