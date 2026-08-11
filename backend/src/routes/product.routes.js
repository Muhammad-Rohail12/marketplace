const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const authorize = require('../auth/middlewares/authorize.middleware');
const ROLES = require('../constants/roles');
const controller = require('../product/controllers/product.controller');
const mediaController = require('../media/controllers/media.controller');

const router = express.Router();

// Public
router.get('/slug/:slug', controller.getPublicProduct);
router.get('/category/:categoryId', controller.listByCategory);
router.get('/brand/:brandId', controller.listByBrand);
router.get('/:id/related', controller.getRelated);
router.get('/:id/media', mediaController.getPublicMedia);

// Admin
router.get('/', authenticate, authorize(ROLES.ADMIN), controller.listAllProducts);
router.get('/:id', authenticate, authorize(ROLES.ADMIN), controller.getProduct);
router.post('/:id/approve', authenticate, authorize(ROLES.ADMIN), controller.approveProduct);
router.post('/:id/reject', authenticate, authorize(ROLES.ADMIN), controller.rejectProduct);
router.post('/:id/deactivate', authenticate, authorize(ROLES.ADMIN), controller.deactivateProduct);
router.post('/:id/archive', authenticate, authorize(ROLES.ADMIN), controller.adminArchiveProduct);
router.delete('/:id/media/:mediaId', authenticate, authorize(ROLES.ADMIN), mediaController.adminDeleteMedia);

module.exports = router;