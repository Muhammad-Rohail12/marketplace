const jwtUtil = require('../utils/jwt.util');
const AUTH_CONSTANTS = require('../../constants/auth');
const AuthenticationError = require('../../errors/AuthenticationError');
const InvalidTokenError = require('../../errors/InvalidTokenError');
const TokenExpiredError = require('../../errors/TokenExpiredError');

const extractToken = (req) => {
  const header = req.headers[AUTH_CONSTANTS.HEADER_NAMES.AUTHORIZATION];
  if (header && header.startsWith('Bearer ')) {
    return header.slice(7);
  }
  return null;
};

// Requires a valid access token. Attaches the decoded JWT payload to
// req.user. NOTE: no database lookup happens here yet — req.user is
// only the token payload until the User service exists (Milestone 2).
// Not attached to any route yet.
const authenticate = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return next(new AuthenticationError(AUTH_CONSTANTS.AUTH_MESSAGES.TOKEN_MISSING));
  }

  try {
    req.user = jwtUtil.verifyAccessToken(token);
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new TokenExpiredError(AUTH_CONSTANTS.AUTH_MESSAGES.TOKEN_EXPIRED));
    }
    return next(new InvalidTokenError(AUTH_CONSTANTS.AUTH_MESSAGES.TOKEN_INVALID));
  }
};

module.exports = authenticate;