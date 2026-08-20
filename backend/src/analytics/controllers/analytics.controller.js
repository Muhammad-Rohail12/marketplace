const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const service = require('../services/analytics.service');

const sellerOverview = asyncHandler(async (req, res) => sendSuccess(res, { message: 'Seller analytics retrieved', data: { analytics: await service.sellerOverview(req.user.id) } }));

module.exports = { sellerOverview };
