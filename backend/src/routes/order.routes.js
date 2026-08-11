const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const controller = require('../order/controllers/order.controller');

const router = express.Router();
router.use(authenticate);

router.post('/', controller.placeOrder);
router.get('/', controller.listMyOrders);
router.get('/:id', controller.getMyOrder);
router.post('/:id/cancel', controller.cancelMyOrder);

module.exports = router;