const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const controller = require('../checkout/controllers/checkout.controller');

const router = express.Router();
router.use(authenticate);

router.post('/', controller.createSession);
router.get('/:id', controller.getSession);
router.post('/:id/cancel', controller.cancelSession);

module.exports = router;