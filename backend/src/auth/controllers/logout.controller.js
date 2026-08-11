const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const { revokeSession } = require('../services/session.service');
const cookieUtil = require('../utils/cookie.util');

const logout = asyncHandler(async (req, res) => {
  const rawRefreshToken = req.cookies?.[cookieUtil.REFRESH_TOKEN_COOKIE_NAME];

  await revokeSession(rawRefreshToken);

  res.clearCookie(cookieUtil.REFRESH_TOKEN_COOKIE_NAME, cookieUtil.getClearCookieOptions());

  return sendSuccess(res, {
    statusCode: httpStatus.OK,
    message: 'Logged out successfully',
    data: {},
  });
});

module.exports = { logout };