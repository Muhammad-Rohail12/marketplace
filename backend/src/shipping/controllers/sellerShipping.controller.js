const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const { validateShippingRateInput, validateSellerSettingsInput } = require('../validators/shippingRate.validator');
const service = require('../services/sellerShipping.service');

const getSettings = asyncHandler(async (req, res) => {
  const settings = await service.getMySettings(req.user.id);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Settings retrieved', data: { settings } });
});
const updateSettings = asyncHandler(async (req, res) => {
  const v = validateSellerSettingsInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const settings = await service.upsertMySettings(req.user.id, v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Settings updated', data: { settings } });
});

const listRates = asyncHandler(async (req, res) => {
  const rates = await service.listMyRates(req.user.id);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Rates retrieved', data: { rates } });
});
const createRate = asyncHandler(async (req, res) => {
  const v = validateShippingRateInput(req.body, { isCreate: true });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const rate = await service.createMyRate(req.user.id, v.data);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Rate created', data: { rate } });
});
const updateRate = asyncHandler(async (req, res) => {
  const v = validateShippingRateInput(req.body, { isCreate: false });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const rate = await service.updateMyRate(req.user.id, Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Rate updated', data: { rate } });
});
const deleteRate = asyncHandler(async (req, res) => {
  await service.deleteMyRate(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Rate removed', data: {} });
});

module.exports = { getSettings, updateSettings, listRates, createRate, updateRate, deleteRate };