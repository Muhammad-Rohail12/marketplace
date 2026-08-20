const express = require('express');
const authenticate = require('../auth/middlewares/authenticate.middleware');
const optionalAuthenticate = require('../auth/middlewares/optionalAuth.middleware');
const controller = require('../reviews/controllers/review.controller');

const router = express.Router();
router.get('/products/:productId', optionalAuthenticate, controller.listProductReviews);
router.post('/products/:productId', authenticate, controller.createReview);
router.post('/:id/helpful', controller.markHelpful);

module.exports = router;
