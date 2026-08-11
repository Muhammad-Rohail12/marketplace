const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const { rotateSession } = require('../services/session.service');
const cookieUtil = require('../utils/cookie.util');

const refresh = asyncHandler(async (req, res) => {
  const rawRefreshToken = req.cookies?.[cookieUtil.REFRESH_TOKEN_COOKIE_NAME];

  const { accessToken, refreshToken, user } = await rotateSession(rawRefreshToken);

  res.cookie(cookieUtil.REFRESH_TOKEN_COOKIE_NAME, refreshToken, cookieUtil.getRefreshTokenCookieOptions());

  return sendSuccess(res, {
    statusCode: httpStatus.OK,
    message: 'Session refreshed',
    data: { user, accessToken },
  });
});

module.exports = { refresh };