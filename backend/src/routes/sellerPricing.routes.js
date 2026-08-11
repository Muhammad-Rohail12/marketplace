const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const authorize = require('../auth/middlewares/authorize.middleware');
const ROLES = require('../constants/roles');
const controller = require('../pricing/controllers/pricing.controller');

const router = express.Router();
router.use(authenticate, authorize(ROLES.SELLER));

// Price
router.get('/', controller.listMyPricing);
router.post('/products/:productId', controller.createPrice);
router.get('/:id', controller.getMyPrice);
router.patch('/:id', controller.updatePrice);
router.get('/:id/history', controller.getPriceHistory);

// Discounts (nested under a price record)
router.get('/:priceId/discounts', controller.listDiscounts);
router.post('/:priceId/discounts', controller.createDiscount);
router.patch('/discounts/:id', controller.updateDiscount);
router.delete('/discounts/:id', controller.deleteDiscount);

// Deals
router.get('/deals', controller.listMyDeals);
router.post('/deals', controller.createDeal);
router.get('/deals/:id', controller.getDeal);
router.post('/deals/:id/products', controller.addProductToDeal);
router.delete('/deals/discounts/:discountId', controller.removeProductFromDeal);
router.patch('/deals/:id/enabled', controller.setDealEnabled);

module.exports = router;