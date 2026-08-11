const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const { verifyEmailToken } = require('../services/verification.service');

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  const { alreadyVerified, user } = await verifyEmailToken(token);

  return sendSuccess(res, {
    statusCode: httpStatus.OK,
    message: alreadyVerified ? 'Your email is already verified' : 'Email verified successfully',
    data: { alreadyVerified, email: user.email },
  });
});

module.exports = { verifyEmail };