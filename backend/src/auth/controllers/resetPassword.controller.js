const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const { validateResetPasswordInput } = require('../validators/resetPassword.validator');
const { resetPassword: resetPasswordService } = require('../services/resetPassword.service');

const resetPassword = asyncHandler(async (req, res) => {
  const validation = validateResetPasswordInput(req.body);

  if (!validation.isValid) {
    throw new ValidationError('Validation failed', validation.errors);
  }

  await resetPasswordService(validation.data);

  return sendSuccess(res, {
    statusCode: httpStatus.OK,
    message: 'Password reset successful. Please log in with your new password.',
    data: {},
  });
});

module.exports = { resetPassword };