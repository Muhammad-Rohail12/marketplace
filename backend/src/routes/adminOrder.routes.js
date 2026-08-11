const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const authorize = require('../auth/middlewares/authorize.middleware');
const ROLES = require('../constants/roles');
const controller = require('../order/controllers/order.controller');

const router = express.Router();
router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/', controller.listAllOrders);
router.get('/:id', controller.getAdminOrder);
router.patch('/:id/status', controller.adminUpdateStatus);

module.exports = router;