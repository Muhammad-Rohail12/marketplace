const { isValidPhone } = require('../../utils/validation');

const MAX_NAME_LENGTH = 50;
const VALID_LANGUAGES = ['en'];
const VALID_GENDERS = ['male', 'female', 'other', 'prefer_not_to_say'];

const validateUpdateProfileInput = (input = {}) => {
  const errors = [];
  const data = {};

  if (input.firstName !== undefined) {
    const firstName = input.firstName.trim();
    if (!firstName) {
      errors.push({ field: 'firstName', message: 'First name cannot be empty' });
    } else if (firstName.length > MAX_NAME_LENGTH) {
      errors.push({ field: 'firstName', message: `First name must be under ${MAX_NAME_LENGTH} characters` });
    } else {
      data.firstName = firstName;
    }
  }

  if (input.lastName !== undefined) {
    const lastName = input.lastName.trim();
    if (!lastName) {
      errors.push({ field: 'lastName', message: 'Last name cannot be empty' });
    } else if (lastName.length > MAX_NAME_LENGTH) {
      errors.push({ field: 'lastName', message: `Last name must be under ${MAX_NAME_LENGTH} characters` });
    } else {
      data.lastName = lastName;
    }
  }

  if (input.phone !== undefined) {
    const phone = (input.phone || '').trim();
    if (phone && !isValidPhone(phone)) {
      errors.push({ field: 'phone', message: 'Enter a valid phone number' });
    } else {
      data.phone = phone || null;
    }
  }

  if (input.dateOfBirth !== undefined) {
    if (input.dateOfBirth) {
      const parsed = new Date(input.dateOfBirth);
      if (isNaN(parsed.getTime())) {
        errors.push({ field: 'dateOfBirth', message: 'Enter a valid date' });
      } else if (parsed > new Date()) {
        errors.push({ field: 'dateOfBirth', message: 'Date of birth cannot be in the future' });
      } else {
        data.dateOfBirth = parsed;
      }
    } else {
      data.dateOfBirth = null;
    }
  }

  if (input.gender !== undefined) {
    if (input.gender && !VALID_GENDERS.includes(input.gender)) {
      errors.push({ field: 'gender', message: 'Invalid gender value' });
    } else {
      data.gender = input.gender || null;
    }
  }

  if (input.preferredLanguage !== undefined) {
    if (!VALID_LANGUAGES.includes(input.preferredLanguage)) {
      errors.push({ field: 'preferredLanguage', message: 'Unsupported language' });
    } else {
      data.preferredLanguage = input.preferredLanguage;
    }
  }

  if (input.timeZone !== undefined) {
    const timeZone = (input.timeZone || '').trim();
    if (timeZone) {
      try {
        Intl.DateTimeFormat(undefined, { timeZone });
        data.timeZone = timeZone;
      } catch {
        errors.push({ field: 'timeZone', message: 'Invalid time zone' });
      }
    } else {
      data.timeZone = null;
    }
  }

  return { isValid: errors.length === 0, errors, data };
};

module.exports = { validateUpdateProfileInput };