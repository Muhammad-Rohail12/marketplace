const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const authorize = require('../auth/middlewares/authorize.middleware');
const ROLES = require('../constants/roles');
const controller = require('../inventory/controllers/inventory.controller');

const router = express.Router();
router.use(authenticate, authorize(ROLES.SELLER));

router.get('/', controller.listMyInventory);
router.get('/summary', controller.getSummary);
router.post('/products/:productId', controller.createInventory);
router.get('/:id', controller.getInventoryDetail);
router.post('/:id/adjust', controller.adjustStock);
router.post('/:id/restock', controller.restock);
router.patch('/:id/threshold', controller.updateThreshold);
router.get('/:id/history', controller.getStockHistory);

module.exports = router;