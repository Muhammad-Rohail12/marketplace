const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const controller = require('../notifications/controllers/notification.controller');

const router = express.Router();
router.use(authenticate);
router.get('/', controller.list);
router.post('/read-all', controller.readAll);
router.post('/:id/read', controller.read);

module.exports = router;
