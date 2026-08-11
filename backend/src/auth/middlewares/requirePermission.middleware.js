const { hasPermission } = require('../utils/permission.util');
const AuthorizationError = require('../../errors/AuthorizationError');
const AUTH_CONSTANTS = require('../../constants/auth');

// Must run after `authenticate`. Restricts access based on the
// permission map rather than a hardcoded role list — use this instead
// of `authorize(...)` whenever the check is really "can this role do
// X" rather than "is this role literally Y".
const requirePermission = (permission) => (req, res, next) => {
  if (!req.user || !hasPermission(req.user.role, permission)) {
    return next(new AuthorizationError(AUTH_CONSTANTS.AUTH_MESSAGES.FORBIDDEN));
  }
  next();
};

module.exports = requirePermission;