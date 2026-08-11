const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const authorize = require('../auth/middlewares/authorize.middleware');
const ROLES = require('../constants/roles');
const controller = require('../shipping/controllers/shipping.controller');

const router = express.Router();

router.get('/methods', controller.listMethods); // public

router.use(authenticate, authorize(ROLES.ADMIN));
router.get('/admin/methods', controller.listAllMethods);
router.post('/admin/methods', controller.createMethod);
router.patch('/admin/methods/:id', controller.updateMethod);
router.delete('/admin/methods/:id', controller.deleteMethod);
router.get('/admin/default-rates', controller.listDefaultRates);
router.post('/admin/default-rates', controller.createDefaultRate);
router.patch('/admin/default-rates/:id', controller.updateDefaultRate);
router.delete('/admin/default-rates/:id', controller.deleteDefaultRate);

module.exports = router;