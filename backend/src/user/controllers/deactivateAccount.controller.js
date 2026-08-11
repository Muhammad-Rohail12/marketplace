const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const { validateDeactivateInput } = require('../validators/deactivateAccount.validator');
const { deactivateAccount: deactivateAccountService } = require('../services/deactivateAccount.service');
const cookieUtil = require('../../auth/utils/cookie.util');

const deactivateAccount = asyncHandler(async (req, res) => {
  const validation = validateDeactivateInput(req.body);

  if (!validation.isValid) {
    throw new ValidationError('Validation failed', validation.errors);
  }

  await deactivateAccountService(req.user.id, validation.data);

  res.clearCookie(cookieUtil.REFRESH_TOKEN_COOKIE_NAME, cookieUtil.getClearCookieOptions());

  return sendSuccess(res, {
    statusCode: httpStatus.OK,
    message: 'Your account has been deactivated',
    data: {},
  });
});

module.exports = { deactivateAccount };