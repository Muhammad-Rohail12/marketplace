const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const authorize = require('../auth/middlewares/authorize.middleware');
const ROLES = require('../constants/roles');
const controller = require('../pricing/controllers/pricing.controller');

const router = express.Router();

// Public
router.get('/products/:productId', controller.getProductPricing);
router.get('/variants/:variantId', controller.getVariantPricing);
router.get('/batch', controller.getPricingBatch);

// Admin
router.get('/', authenticate, authorize(ROLES.ADMIN), controller.listAllPricing);
router.post('/:id/adjust', authenticate, authorize(ROLES.ADMIN), controller.adminAdjustPrice);

module.exports = router;