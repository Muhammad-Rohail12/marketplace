const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const controller = require('../wishlist/controllers/wishlist.controller');

const router = express.Router();
router.use(authenticate);
router.get('/', controller.list);
router.post('/', controller.add);
router.delete('/:productId', controller.remove);

module.exports = router;
