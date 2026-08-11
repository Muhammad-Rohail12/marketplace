import { isValidEmail, isStrongPassword, isNotEmpty } from './validators';

const MAX_NAME_LENGTH = 50;

export function validateRegisterForm(values) {
  const errors = {};

  const firstName = (values.firstName || '').trim();
  const lastName = (values.lastName || '').trim();
  const email = (values.email || '').trim();
  const password = values.password || '';
  const confirmPassword = values.confirmPassword || '';

  if (!isNotEmpty(firstName)) {
    errors.firstName = 'First name is required';
  } else if (firstName.length > MAX_NAME_LENGTH) {
    errors.firstName = `First name must be under ${MAX_NAME_LENGTH} characters`;
  }

  if (!isNotEmpty(lastName)) {
    errors.lastName = 'Last name is required';
  } else if (lastName.length > MAX_NAME_LENGTH) {
    errors.lastName = `Last name must be under ${MAX_NAME_LENGTH} characters`;
  }

  if (!isNotEmpty(email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (!isStrongPassword(password)) {
    errors.password = 'Must be 8+ characters with uppercase, lowercase, and a number';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (password && confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}