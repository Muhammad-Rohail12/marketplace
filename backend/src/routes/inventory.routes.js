const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const authorize = require('../auth/middlewares/authorize.middleware');
const ROLES = require('../constants/roles');
const controller = require('../inventory/controllers/inventory.controller');

const router = express.Router();

// Public
router.get('/products/:productId/availability', controller.getProductAvailability);
router.get('/variants/:variantId/availability', controller.getVariantAvailability);

// Admin
router.get('/', authenticate, authorize(ROLES.ADMIN), controller.listAllInventory);
router.post('/:id/adjust', authenticate, authorize(ROLES.ADMIN), controller.adminAdjustStock);
router.get('/:id/history', authenticate, authorize(ROLES.ADMIN), controller.adminGetStockHistory);

module.exports = router;