const jwtUtil = require('../utils/jwt.util');
const AUTH_CONSTANTS = require('../../constants/auth');

// Attaches req.user if a valid token is present; otherwise proceeds
// as an anonymous request without throwing. Not attached to any
// route yet.
const optionalAuthenticate = (req, res, next) => {
  const header = req.headers[AUTH_CONSTANTS.HEADER_NAMES.AUTHORIZATION];
  const token = header && header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return next();

  try {
    req.user = jwtUtil.verifyAccessToken(token);
  } catch (err) {
    // Invalid/expired token on an optional route — ignore, continue anonymously.
  }

  next();
};

module.exports = optionalAuthenticate;