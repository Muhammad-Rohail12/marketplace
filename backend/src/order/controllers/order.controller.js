const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const AppError = require('../../errors/AppError');
const errorCodes = require('../../constants/errorCodes');
const service = require('../services/order.service');

const placeOrder = asyncHandler(async (req, res) => {
  const sessionId = Number(req.body.checkoutSessionId);
  const orderIds = await service.createOrdersFromCheckoutSession(req.user.id, sessionId);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Order placed successfully', data: { orderIds } });
});

const listMyOrders = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listMyOrders(req.user.id, req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Orders retrieved', data: { orders: items }, meta });
});

const getMyOrder = asyncHandler(async (req, res) => {
  const order = await service.getMyOrder(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Order retrieved', data: { order } });
});

const cancelMyOrder = asyncHandler(async (req, res) => {
  if (!req.body.reason || !req.body.reason.trim()) {
    throw new AppError('A cancellation reason is required', httpStatus.BAD_REQUEST, errorCodes.CANCEL_REASON_REQUIRED);
  }
  const order = await service.buyerCancelOrder(req.user.id, Number(req.params.id), req.body.reason.trim());
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Order cancelled', data: { order } });
});

const listSellerOrders = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listSellerOrders(req.user.id, req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Orders retrieved', data: { orders: items }, meta });
});

const getSellerOrder = asyncHandler(async (req, res) => {
  const order = await service.getSellerOrder(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Order retrieved', data: { order } });
});

const sellerUpdateStatus = asyncHandler(async (req, res) => {
  const order = await service.sellerUpdateStatus(req.user.id, Number(req.params.id), req.body.status, req.body.note);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Order status updated', data: { order } });
});

const listAllOrders = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listAllOrders(req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Orders retrieved', data: { orders: items }, meta });
});

const getAdminOrder = asyncHandler(async (req, res) => {
  const order = await service.getAdminOrder(Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Order retrieved', data: { order } });
});

const adminUpdateStatus = asyncHandler(async (req, res) => {
  const order = await service.adminUpdateStatus(req.user.id, Number(req.params.id), req.body.status, req.body.note);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Order status updated', data: { order } });
});

module.exports = {
  placeOrder, listMyOrders, getMyOrder, cancelMyOrder,
  listSellerOrders, getSellerOrder, sellerUpdateStatus,
  listAllOrders, getAdminOrder, adminUpdateStatus,
};