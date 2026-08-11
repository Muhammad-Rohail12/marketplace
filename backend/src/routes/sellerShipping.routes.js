const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const authorize = require('../auth/middlewares/authorize.middleware');
const ROLES = require('../constants/roles');
const controller = require('../shipping/controllers/sellerShipping.controller');

const router = express.Router();
router.use(authenticate, authorize(ROLES.SELLER));

router.get('/settings', controller.getSettings);
router.put('/settings', controller.updateSettings);
router.get('/rates', controller.listRates);
router.post('/rates', controller.createRate);
router.patch('/rates/:id', controller.updateRate);
router.delete('/rates/:id', controller.deleteRate);

module.exports = router;