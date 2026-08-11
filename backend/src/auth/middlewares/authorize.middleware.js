const AuthorizationError = require('../../errors/AuthorizationError');
const AUTH_CONSTANTS = require('../../constants/auth');

// Must run after `authenticate`. Restricts access to specific roles.
// Not attached to any route yet.
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return next(new AuthorizationError(AUTH_CONSTANTS.AUTH_MESSAGES.FORBIDDEN));
  }
  next();
};

module.exports = authorize;