const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const authorize = require('../auth/middlewares/authorize.middleware');
const requirePermission = require('../auth/middlewares/requirePermission.middleware');
const requireFreshAccount = require('../auth/middlewares/requireFreshAccount.middleware');
const { sendSuccess } = require('../utils/responseHandler');
const httpStatus = require('../constants/httpStatus');
const ROLES = require('../constants/roles');
const PERMISSIONS = require('../constants/permissions');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// PURPOSE: temporary endpoints for verifying Phase 15's RBAC system.
// Not real business routes — will be removed once actual
// Product/Order/Seller routes exist to test against instead.

router.get(
  '/buyer-only',
  authenticate,
  authorize(ROLES.BUYER),
  asyncHandler(async (req, res) => {
    sendSuccess(res, { statusCode: httpStatus.OK, message: 'Buyer access granted', data: { role: req.user.role } });
  })
);

router.get(
  '/seller-only',
  authenticate,
  authorize(ROLES.SELLER),
  asyncHandler(async (req, res) => {
    sendSuccess(res, { statusCode: httpStatus.OK, message: 'Seller access granted', data: { role: req.user.role } });
  })
);

router.get(
  '/admin-only',
  authenticate,
  authorize(ROLES.ADMIN),
  requireFreshAccount,
  asyncHandler(async (req, res) => {
    sendSuccess(res, { statusCode: httpStatus.OK, message: 'Admin access granted', data: { role: req.user.role } });
  })
);

router.get(
  '/manage-products',
  authenticate,
  requirePermission(PERMISSIONS.PRODUCT_CREATE),
  asyncHandler(async (req, res) => {
    sendSuccess(res, {
      statusCode: httpStatus.OK,
      message: 'Permission granted: Product.Create',
      data: { role: req.user.role },
    });
  })
);

module.exports = router;