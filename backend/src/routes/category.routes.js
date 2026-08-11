const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const authorize = require('../auth/middlewares/authorize.middleware');
const optionalAuthenticate = require('../auth/middlewares/optionalAuth.middleware');
const ROLES = require('../constants/roles');
const controller = require('../categories/controllers/category.controller');
const { uploadCategoryImages } = require('../categories/middlewares/uploadCategoryImages.middleware');

const router = express.Router();

// PUBLIC reads (optionalAuthenticate lets admins see inactive/deleted
// via the same endpoints without needing separate admin-only routes)
router.get('/tree', optionalAuthenticate, controller.getTree);
router.get('/featured', controller.getFeatured);
router.get('/homepage', controller.getHomepage);
router.get('/navigation', controller.getNavigation);
router.get('/slug/:slug', optionalAuthenticate, controller.getCategoryBySlug);
router.get('/:id/children', controller.getChildren);
router.get('/:id/breadcrumb', controller.getBreadcrumb);
router.get('/:id', optionalAuthenticate, controller.getCategory);
router.get('/', optionalAuthenticate, controller.listCategories);

// ADMIN writes
router.post('/', authenticate, authorize(ROLES.ADMIN), uploadCategoryImages, controller.createCategory);
router.patch('/:id', authenticate, authorize(ROLES.ADMIN), uploadCategoryImages, controller.updateCategory);
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), controller.deleteCategory);
router.post('/:id/restore', authenticate, authorize(ROLES.ADMIN), controller.restoreCategory);

module.exports = router;