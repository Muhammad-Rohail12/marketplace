const validateDeactivateInput = (input = {}) => {
  const errors = [];
  const password = input.password || '';

  if (!password) {
    errors.push({ field: 'password', message: 'Password confirmation is required' });
  }

  return { isValid: errors.length === 0, errors, data: { password } };
};

module.exports = { validateDeactivateInput };