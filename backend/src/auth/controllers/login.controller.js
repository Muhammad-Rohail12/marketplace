const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const { validateLoginInput } = require('../validators/login.validator');
const { loginUser } = require('../services/login.service');
const cookieUtil = require('../utils/cookie.util');

const login = asyncHandler(async (req, res) => {
  const validation = validateLoginInput(req.body);

  if (!validation.isValid) {
    throw new ValidationError('Validation failed', validation.errors);
  }

  const { user, accessToken, refreshToken } = await loginUser(validation.data);

  res.cookie(cookieUtil.REFRESH_TOKEN_COOKIE_NAME, refreshToken, cookieUtil.getRefreshTokenCookieOptions());

  return sendSuccess(res, {
    statusCode: httpStatus.OK,
    message: 'Login successful',
    data: { user, accessToken },
  });
});

module.exports = { login };