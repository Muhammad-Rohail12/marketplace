const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const { validateShippingMethodInput } = require('../validators/shippingMethod.validator');
const { validateShippingRateInput } = require('../validators/shippingRate.validator');
const methodService = require('../services/shippingMethod.service');

const listMethods = asyncHandler(async (req, res) => {
  const methods = await methodService.listActive();
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Shipping methods retrieved', data: { methods } });
});

// Admin
const listAllMethods = asyncHandler(async (req, res) => {
  const methods = await methodService.listAll();
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Shipping methods retrieved', data: { methods } });
});
const createMethod = asyncHandler(async (req, res) => {
  const v = validateShippingMethodInput(req.body, { isCreate: true });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const method = await methodService.create(v.data);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Shipping method created', data: { method } });
});
const updateMethod = asyncHandler(async (req, res) => {
  const v = validateShippingMethodInput(req.body, { isCreate: false });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const method = await methodService.update(Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Shipping method updated', data: { method } });
});
const deleteMethod = asyncHandler(async (req, res) => {
  await methodService.remove(Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Shipping method disabled', data: {} });
});

const listDefaultRates = asyncHandler(async (req, res) => {
  const rates = await methodService.listDefaultRates();
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Default rates retrieved', data: { rates } });
});
const createDefaultRate = asyncHandler(async (req, res) => {
  const v = validateShippingRateInput(req.body, { isCreate: true });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const rate = await methodService.createDefaultRate(v.data);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Default rate created', data: { rate } });
});
const updateDefaultRate = asyncHandler(async (req, res) => {
  const v = validateShippingRateInput(req.body, { isCreate: false });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const rate = await methodService.updateDefaultRate(Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Default rate updated', data: { rate } });
});
const deleteDefaultRate = asyncHandler(async (req, res) => {
  await methodService.deleteDefaultRate(Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Default rate removed', data: {} });
});

module.exports = { listMethods, listAllMethods, createMethod, updateMethod, deleteMethod, listDefaultRates, createDefaultRate, updateDefaultRate, deleteDefaultRate };