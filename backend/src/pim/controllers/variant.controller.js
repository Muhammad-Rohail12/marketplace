const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const validators = require('../validators/variant.validator');
const service = require('../services/variant.service');

const createVariantOption = asyncHandler(async (req, res) => {
  const v = validators.validateVariantOptionInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const option = await service.createVariantOption(v.data);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Variant option created', data: { option } });
});

const deleteVariantOption = asyncHandler(async (req, res) => {
  await service.deleteVariantOption(Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Variant option deleted', data: {} });
});

const listVariantOptions = asyncHandler(async (req, res) => {
  const options = await service.listVariantOptions(req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Variant options retrieved', data: { options } });
});

const createVariantCombination = asyncHandler(async (req, res) => {
  const v = validators.validateVariantCombinationInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const combination = await service.createVariantCombination(v.data, v.optionIds);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Variant combination created', data: { combination } });
});

const updateVariantCombination = asyncHandler(async (req, res) => {
  const v = validators.validateVariantCombinationInput(req.body, { isUpdate: true });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const combination = await service.updateVariantCombination(Number(req.params.id), v.data, v.optionIds);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Variant combination updated', data: { combination } });
});

const deleteVariantCombination = asyncHandler(async (req, res) => {
  await service.deleteVariantCombination(Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Variant combination deleted', data: {} });
});

const listVariantCombinations = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listVariantCombinations(req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Variant combinations retrieved', data: { combinations: items }, meta });
});

module.exports = {
  createVariantOption, deleteVariantOption, listVariantOptions,
  createVariantCombination, updateVariantCombination, deleteVariantCombination, listVariantCombinations,
};