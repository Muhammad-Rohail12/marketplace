const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const service = require('../services/checkout.service');

const createSession = asyncHandler(async (req, res) => {
  const session = await service.createSession(req.user.id);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Checkout session created', data: { session } });
});

const getSession = asyncHandler(async (req, res) => {
  const session = await service.getSessionDetail(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Checkout session retrieved', data: { session } });
});

const cancelSession = asyncHandler(async (req, res) => {
  const session = await service.cancelSession(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Checkout session cancelled', data: { session } });
});

module.exports = { createSession, getSession, cancelSession };