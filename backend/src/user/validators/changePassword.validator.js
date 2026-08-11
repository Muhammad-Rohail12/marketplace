const { isStrongPassword } = require('../../utils/validation');

const validateChangePasswordInput = (input = {}) => {
  const errors = [];

  const currentPassword = input.currentPassword || '';
  const newPassword = input.newPassword || '';
  const confirmNewPassword = input.confirmNewPassword || '';

  if (!currentPassword) {
    errors.push({ field: 'currentPassword', message: 'Current password is required' });
  }

  if (!newPassword) {
    errors.push({ field: 'newPassword', message: 'New password is required' });
  } else if (!isStrongPassword(newPassword)) {
    errors.push({
      field: 'newPassword',
      message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number',
    });
  } else if (currentPassword && newPassword === currentPassword) {
    errors.push({ field: 'newPassword', message: 'New password must be different from your current password' });
  }

  if (!confirmNewPassword) {
    errors.push({ field: 'confirmNewPassword', message: 'Please confirm your new password' });
  } else if (newPassword && confirmNewPassword !== newPassword) {
    errors.push({ field: 'confirmNewPassword', message: 'Passwords do not match' });
  }

  return { isValid: errors.length === 0, errors, data: { currentPassword, newPassword } };
};

module.exports = { validateChangePasswordInput };