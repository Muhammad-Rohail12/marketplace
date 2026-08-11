const { isStrongPassword } = require('../../utils/validation');

const validateResetPasswordInput = (input = {}) => {
  const errors = [];

  const token = (input.token || '').trim();
  const password = input.password || '';
  const confirmPassword = input.confirmPassword || '';

  if (!token) {
    errors.push({ field: 'token', message: 'Reset token is required' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (!isStrongPassword(password)) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number',
    });
  }

  if (!confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Please confirm your password' });
  } else if (password && confirmPassword !== password) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }

  return { isValid: errors.length === 0, errors, data: { token, password } };
};

module.exports = { validateResetPasswordInput };