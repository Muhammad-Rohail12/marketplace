const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const validators = require('../validators/productConfig.validator');
const service = require('../services/productConfig.service');

const createSkuConfig = asyncHandler(async (req, res) => {
  const v = validators.validateSkuConfigInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const config = await service.createSkuConfig(v.data);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'SKU configuration created', data: { config } });
});

const updateSkuConfig = asyncHandler(async (req, res) => {
  const v = validators.validateSkuConfigInput(req.body, { isUpdate: true });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const config = await service.updateSkuConfig(Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'SKU configuration updated', data: { config } });
});

const deleteSkuConfig = asyncHandler(async (req, res) => {
  await service.deleteSkuConfig(Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'SKU configuration deleted', data: {} });
});

const listSkuConfigs = asyncHandler(async (req, res) => {
  const configs = await service.listSkuConfigs();
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'SKU configurations retrieved', data: { configs } });
});

const createBarcodeConfig = asyncHandler(async (req, res) => {
  const v = validators.validateBarcodeConfigInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const config = await service.createBarcodeConfig(v.data);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Barcode configuration created', data: { config } });
});

const updateBarcodeConfig = asyncHandler(async (req, res) => {
  const v = validators.validateBarcodeConfigInput(req.body, { isUpdate: true });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const config = await service.updateBarcodeConfig(Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Barcode configuration updated', data: { config } });
});

const deleteBarcodeConfig = asyncHandler(async (req, res) => {
  await service.deleteBarcodeConfig(Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Barcode configuration deleted', data: {} });
});

const listBarcodeConfigs = asyncHandler(async (req, res) => {
  const configs = await service.listBarcodeConfigs();
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Barcode configurations retrieved', data: { configs } });
});

module.exports = {
  createSkuConfig, updateSkuConfig, deleteSkuConfig, listSkuConfigs,
  createBarcodeConfig, updateBarcodeConfig, deleteBarcodeConfig, listBarcodeConfigs,
};