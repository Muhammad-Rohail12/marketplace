const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const { validateAddressInput } = require('../validators/address.validator');
const service = require('../services/address.service');
const { US_STATES } = require('../constants/usStates.constants');

const listStates = asyncHandler(async (req, res) => {
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'US states retrieved', data: { states: US_STATES } });
});

const listMyAddresses = asyncHandler(async (req, res) => {
  const addresses = await service.listMyAddresses(req.user.id);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Addresses retrieved', data: { addresses } });
});

const getMyAddress = asyncHandler(async (req, res) => {
  const address = await service.getMyAddress(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Address retrieved', data: { address } });
});

const createAddress = asyncHandler(async (req, res) => {
  const v = validateAddressInput(req.body, { isCreate: true });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const address = await service.createAddress(req.user.id, v.data);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Address saved', data: { address } });
});

const updateAddress = asyncHandler(async (req, res) => {
  const v = validateAddressInput(req.body, { isCreate: false });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const address = await service.updateAddress(req.user.id, Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Address updated', data: { address } });
});

const setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await service.setDefaultAddress(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Default address updated', data: { address } });
});

const deleteAddress = asyncHandler(async (req, res) => {
  await service.deleteAddress(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Address removed', data: {} });
});

module.exports = { listStates, listMyAddresses, getMyAddress, createAddress, updateAddress, setDefaultAddress, deleteAddress };