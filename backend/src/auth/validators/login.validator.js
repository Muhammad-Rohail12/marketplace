const { isValidEmail } = require('../../utils/validation');

const validateLoginInput = (input = {}) => {
  const errors = [];

  const email = (input.email || '').trim().toLowerCase();
  const password = input.password || '';

  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Enter a valid email address' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: { email, password },
  };
};

module.exports = { validateLoginInput };