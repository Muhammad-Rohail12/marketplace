const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const authorize = require('../auth/middlewares/authorize.middleware');
const ROLES = require('../constants/roles');
const controller = require('../store/controllers/store.controller');
const { uploadStoreMedia } = require('../store/middlewares/uploadStoreMedia.middleware');

const router = express.Router();

// Every route here resolves the store via req.user.id -> Seller ->
// Store. No :id param exists on any of these, so there is nothing
// for a seller to tamper with to access another seller's data.
router.get('/profile', authenticate, authorize(ROLES.SELLER), controller.getMySellerProfile);
router.get('/store', authenticate, authorize(ROLES.SELLER), controller.getMyStore);
router.patch('/store', authenticate, authorize(ROLES.SELLER), controller.updateMyStore);
router.put('/store/policies', authenticate, authorize(ROLES.SELLER), controller.updatePolicies);
router.post('/store/media', authenticate, authorize(ROLES.SELLER), uploadStoreMedia, controller.updateMedia);

module.exports = router;