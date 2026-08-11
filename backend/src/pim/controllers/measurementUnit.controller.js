const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const { validateMeasurementUnitInput } = require('../validators/measurementUnit.validator');
const service = require('../services/measurementUnit.service');

const createUnit = asyncHandler(async (req, res) => {
  const v = validateMeasurementUnitInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const unit = await service.createUnit(v.data);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Measurement unit created', data: { unit } });
});

const updateUnit = asyncHandler(async (req, res) => {
  const v = validateMeasurementUnitInput(req.body, { isUpdate: true });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const unit = await service.updateUnit(Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Measurement unit updated', data: { unit } });
});

const deleteUnit = asyncHandler(async (req, res) => {
  await service.deleteUnit(Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Measurement unit deleted', data: {} });
});

const listUnits = asyncHandler(async (req, res) => {
  const units = await service.listUnits(req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Measurement units retrieved', data: { units } });
});

module.exports = { createUnit, updateUnit, deleteUnit, listUnits };