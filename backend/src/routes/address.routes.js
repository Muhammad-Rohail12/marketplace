const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const controller = require('../address/controllers/address.controller');

const router = express.Router();

// US states list is static reference data — safe to expose without
// authentication (used to populate the state dropdown pre-login too).
router.get('/states', controller.listStates);

router.use(authenticate);
router.get('/', controller.listMyAddresses);
router.post('/', controller.createAddress);
router.get('/:id', controller.getMyAddress);
router.patch('/:id', controller.updateAddress);
router.patch('/:id/default', controller.setDefaultAddress);
router.delete('/:id', controller.deleteAddress);

module.exports = router;