const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const authorize = require('../auth/middlewares/authorize.middleware');
const ROLES = require('../constants/roles');
const controller = require('../order/controllers/order.controller');

const router = express.Router();
router.use(authenticate, authorize(ROLES.SELLER));

router.get('/', controller.listSellerOrders);
router.get('/:id', controller.getSellerOrder);
router.patch('/:id/status', controller.sellerUpdateStatus);

module.exports = router;