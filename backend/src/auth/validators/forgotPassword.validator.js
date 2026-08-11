const { isValidEmail } = require('../../utils/validation');

const validateForgotPasswordInput = (input = {}) => {
  const errors = [];
  const email = (input.email || '').trim().toLowerCase();

  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Enter a valid email address' });
  }

  return { isValid: errors.length === 0, errors, data: { email } };
};

module.exports = { validateForgotPasswordInput };