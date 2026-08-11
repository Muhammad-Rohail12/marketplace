const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const { isValidEmail } = require('../../utils/validation');
const { resendVerificationEmail } = require('../services/verification.service');

const resendVerification = asyncHandler(async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();

  if (!email || !isValidEmail(email)) {
    throw new ValidationError('Validation failed', [{ field: 'email', message: 'Enter a valid email address' }]);
  }

  await resendVerificationEmail(email);

  return sendSuccess(res, {
    statusCode: httpStatus.OK,
    message: 'If an account with that email exists and is unverified, a verification link has been sent.',
    data: {},
  });
});

module.exports = { resendVerification };