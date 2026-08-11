const authConfig = require('../config/auth.config');
const AUTH_CONSTANTS = require('../../constants/auth');

const DURATION_MULTIPLIERS = { s: 1000, m: 60000, h: 3600000, d: 86400000 };

const parseDurationToMs = (duration) => {
  const match = /^(\d+)([smhd])$/.exec(duration || '');
  if (!match) return 7 * DURATION_MULTIPLIERS.d; // fallback: 7 days
  return Number(match[1]) * DURATION_MULTIPLIERS[match[2]];
};

const getRefreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: authConfig.cookie.secure,
  sameSite: authConfig.cookie.sameSite,
  maxAge: parseDurationToMs(authConfig.jwt.refreshExpiresIn),
  path: '/api/auth',
});

// Used by logout to clear the cookie — must match path/sameSite/secure
// of the original cookie for the browser to actually remove it.
const getClearCookieOptions = () => ({
  httpOnly: true,
  secure: authConfig.cookie.secure,
  sameSite: authConfig.cookie.sameSite,
  path: '/api/auth',
});

module.exports = {
  getRefreshTokenCookieOptions,
  getClearCookieOptions,
  parseDurationToMs,
  REFRESH_TOKEN_COOKIE_NAME: AUTH_CONSTANTS.COOKIE_NAMES.REFRESH_TOKEN,
};