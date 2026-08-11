const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const authorize = require('../auth/middlewares/authorize.middleware');
const optionalAuthenticate = require('../auth/middlewares/optionalAuth.middleware');
const ROLES = require('../constants/roles');
const controller = require('../brands/controllers/brand.controller');
const { uploadBrandImages } = require('../brands/middlewares/uploadBrandImages.middleware');

const router = express.Router();

// PUBLIC reads
router.get('/featured', controller.getFeatured);
router.get('/homepage', controller.getHomepage);
router.get('/verified', controller.getVerified);
router.get('/slug/:slug', optionalAuthenticate, controller.getBrandBySlug);
router.get('/:id', optionalAuthenticate, controller.getBrand);
router.get('/', optionalAuthenticate, controller.listBrands);

// ADMIN writes
router.post('/', authenticate, authorize(ROLES.ADMIN), uploadBrandImages, controller.createBrand);
router.patch('/:id', authenticate, authorize(ROLES.ADMIN), uploadBrandImages, controller.updateBrand);
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), controller.deleteBrand);
router.post('/:id/restore', authenticate, authorize(ROLES.ADMIN), controller.restoreBrand);

module.exports = router;