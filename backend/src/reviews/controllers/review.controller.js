const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const reviewService = require('../services/review.service');

const listProductReviews = asyncHandler(async (req, res) => {
  const data = await reviewService.listProductReviews(Number(req.params.productId));
  return sendSuccess(res, { message: 'Product reviews retrieved', data });
});

const createReview = asyncHandler(async (req, res) => {
  const data = await reviewService.createReview(req.user.id, Number(req.params.productId), req.body);
  return sendSuccess(res, { statusCode: 201, message: 'Review created', data: { review: data } });
});

const markHelpful = asyncHandler(async (req, res) => {
  const review = await reviewService.markHelpful(Number(req.params.id));
  return sendSuccess(res, { message: 'Review marked helpful', data: { review } });
});

module.exports = { listProductReviews, createReview, markHelpful };
