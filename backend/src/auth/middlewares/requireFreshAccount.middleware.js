const prisma = require('../../database/prismaClient');
const AuthenticationError = require('../../errors/AuthenticationError');
const AUTH_CONSTANTS = require('../../constants/auth');
const ACCOUNT_STATUS = require('../../constants/accountStatus');

// Must run after `authenticate`. The JWT payload's role/status is a
// snapshot from login time and can go stale within the access
// token's lifetime (e.g. an admin changes a user's role, or the
// account gets suspended, mid-session). This middleware re-checks
// the database on every request it's applied to — use it for
// sensitive/role-restricted routes, not blanket on every request,
// since it adds a DB round trip.
const requireFreshAccount = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user || user.status !== ACCOUNT_STATUS.ACTIVE) {
      return next(new AuthenticationError(AUTH_CONSTANTS.AUTH_MESSAGES.UNAUTHORIZED));
    }

    // Keep req.user in sync with the DB in case role changed since
    // the access token was issued, so downstream authorize()/
    // requirePermission() checks use the current role, not the stale one.
    req.user.role = user.role;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = requireFreshAccount;