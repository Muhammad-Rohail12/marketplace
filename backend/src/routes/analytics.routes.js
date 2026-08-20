const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const authorize = require('../auth/middlewares/authorize.middleware');
const ROLES = require('../constants/roles');
const controller = require('../analytics/controllers/analytics.controller');

const router = express.Router();
router.get('/seller', authenticate, authorize(ROLES.SELLER), controller.sellerOverview);

module.exports = router;
