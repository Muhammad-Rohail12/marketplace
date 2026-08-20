const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const service = require('../services/wishlist.service');

const list = asyncHandler(async (req, res) => sendSuccess(res, { message: 'Wishlist retrieved', data: { items: await service.list(req.user.id) } }));
const add = asyncHandler(async (req, res) => sendSuccess(res, { statusCode: 201, message: 'Product added to wishlist', data: { item: await service.add(req.user.id, Number(req.body.productId)) } }));
const remove = asyncHandler(async (req, res) => { await service.remove(req.user.id, Number(req.params.productId)); return sendSuccess(res, { message: 'Product removed from wishlist' }); });

module.exports = { list, add, remove };
