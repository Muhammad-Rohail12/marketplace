const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const authorize = require('../auth/middlewares/authorize.middleware');
const ROLES = require('../constants/roles');
const controller = require('../store/controllers/store.controller');

const router = express.Router();

// Public
router.get('/slug/:slug', controller.getPublicStore);

// Admin
router.get('/', authenticate, authorize(ROLES.ADMIN), controller.listStores);
router.get('/:id', authenticate, authorize(ROLES.ADMIN), controller.getStore);
router.post('/:id/suspend', authenticate, authorize(ROLES.ADMIN), controller.suspendStore);
router.post('/:id/activate', authenticate, authorize(ROLES.ADMIN), controller.activateStore);
router.patch('/:id/feature', authenticate, authorize(ROLES.ADMIN), controller.featureStore);

module.exports = router;