const { isValidEmail, isStrongPassword } = require('../../utils/validation');

const MAX_NAME_LENGTH = 50;
const MAX_EMAIL_LENGTH = 255;

const validateRegisterInput = (input = {}) => {
  const errors = [];

  const firstName = (input.firstName || '').trim();
  const lastName = (input.lastName || '').trim();
  const email = (input.email || '').trim().toLowerCase();
  const password = input.password || '';
  const confirmPassword = input.confirmPassword || '';

  if (!firstName) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  } else if (firstName.length > MAX_NAME_LENGTH) {
    errors.push({ field: 'firstName', message: `First name must be under ${MAX_NAME_LENGTH} characters` });
  }

  if (!lastName) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  } else if (lastName.length > MAX_NAME_LENGTH) {
    errors.push({ field: 'lastName', message: `Last name must be under ${MAX_NAME_LENGTH} characters` });
  }

  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (email.length > MAX_EMAIL_LENGTH) {
    errors.push({ field: 'email', message: 'Email is too long' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Enter a valid email address' });
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

  return {
    isValid: errors.length === 0,
    errors,
    data: { firstName, lastName, email, password },
  };
};

module.exports = { validateRegisterInput };
