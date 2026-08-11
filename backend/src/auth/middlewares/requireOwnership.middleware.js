const AuthorizationError = require('../../errors/AuthorizationError');
const AUTH_CONSTANTS = require('../../constants/auth');

// Foundation for future "owner or admin" checks (e.g. a seller
// editing only their own product, a buyer viewing only their own
// order). `getOwnerId` is an async function that resolves the
// resource's owner ID from `req` (e.g. by loading the record first).
// Admins always pass. Not applied to any route yet — no owned
// resources exist until the Seller/Marketplace milestone.
const requireOwnership = (getOwnerId) => async (req, res, next) => {
  try {
    if (req.user?.role === 'ADMIN') return next();

    const ownerId = await getOwnerId(req);

    if (!req.user || ownerId !== req.user.id) {
      return next(new AuthorizationError(AUTH_CONSTANTS.AUTH_MESSAGES.FORBIDDEN));
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = requireOwnership;