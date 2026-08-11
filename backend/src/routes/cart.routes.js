const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const controller = require('../cart/controllers/cart.controller');
const cartAddressController = require('../address/controllers/cartAddress.controller');
const cartShippingController = require('../shipping/controllers/cartShipping.controller');

const router = express.Router();
router.use(authenticate);

router.get('/', controller.getCart);
router.get('/count', controller.getCount);
router.post('/items', controller.addItem);
router.patch('/items/:itemId', controller.updateItem);
router.delete('/items/:itemId', controller.removeItem);
router.delete('/', controller.clearCart);
router.post('/validate', controller.validateCart);
router.patch('/delivery-address', cartAddressController.selectCartAddress);
router.patch('/shipping', cartShippingController.selectShipping);

module.exports = router;