const REGEX = require('../constants/regex');

const isValidEmail = (value = '') => REGEX.EMAIL.test(value);
const isValidPhone = (value = '') => REGEX.PHONE.test(value);
const isStrongPassword = (value = '') => REGEX.STRONG_PASSWORD.test(value);
const isValidSlug = (value = '') => REGEX.SLUG.test(value);

const isValidUrl = (value = '') => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

module.exports = { isValidEmail, isValidPhone, isStrongPassword, isValidSlug, isValidUrl };