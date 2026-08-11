const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const authorize = require('../auth/middlewares/authorize.middleware');
const ROLES = require('../constants/roles');
const controller = require('../product/controllers/product.controller');
const mediaRoutes = require('./sellerProductMedia.routes');

const router = express.Router();
router.use(authenticate, authorize(ROLES.SELLER));

router.get('/', controller.listMyProducts);
router.post('/', controller.createProduct);
router.get('/:id', controller.getMyProduct);
router.patch('/:id', controller.updateProduct);
router.put('/:id/attributes', controller.updateAttributes);
router.put('/:id/specifications', controller.updateSpecifications);
router.get('/:id/variants', controller.getMyProduct);
router.post('/:id/variants', controller.createVariant);
router.patch('/:id/variants/:variantId', controller.updateVariant);
router.delete('/:id/variants/:variantId', controller.deleteVariant);
router.post('/:id/submit', controller.submitProduct);
router.post('/:id/archive', controller.archiveProduct);
router.post('/:id/duplicate', controller.duplicateProduct);

router.use('/:id/media', mediaRoutes);

module.exports = router;