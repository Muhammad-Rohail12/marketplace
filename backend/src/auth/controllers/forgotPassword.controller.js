const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const { validateForgotPasswordInput } = require('../validators/forgotPassword.validator');
const { requestPasswordReset } = require('../services/passwordReset.service');

const GENERIC_MESSAGE = 'If an account with that email exists, a password reset link has been sent.';

const forgotPassword = asyncHandler(async (req, res) => {
  const validation = validateForgotPasswordInput(req.body);

  if (!validation.isValid) {
    throw new ValidationError('Validation failed', validation.errors);
  }

  await requestPasswordReset(validation.data.email);

  return sendSuccess(res, {
    statusCode: httpStatus.OK,
    message: GENERIC_MESSAGE,
    data: {},
  });
});

module.exports = { forgotPassword };