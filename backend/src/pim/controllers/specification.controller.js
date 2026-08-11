const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const validators = require('../validators/specification.validator');
const service = require('../services/specification.service');

const createTemplate = asyncHandler(async (req, res) => {
  const v = validators.validateSpecTemplateInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const template = await service.createTemplate(v.data);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Specification template created', data: { template } });
});

const updateTemplate = asyncHandler(async (req, res) => {
  const v = validators.validateSpecTemplateInput(req.body, { isUpdate: true });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const template = await service.updateTemplate(Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Specification template updated', data: { template } });
});

const deleteTemplate = asyncHandler(async (req, res) => {
  await service.deleteTemplate(Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Specification template deleted', data: {} });
});

const getTemplate = asyncHandler(async (req, res) => {
  const template = await service.getTemplateById(Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Specification template retrieved', data: { template } });
});

const listTemplates = asyncHandler(async (req, res) => {
  const templates = await service.listTemplates(req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Specification templates retrieved', data: { templates } });
});

const addTemplateItem = asyncHandler(async (req, res) => {
  const v = validators.validateSpecTemplateItemInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const item = await service.addTemplateItem(Number(req.params.templateId), v.data);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Specification item added', data: { item } });
});

const removeTemplateItem = asyncHandler(async (req, res) => {
  await service.removeTemplateItem(Number(req.params.itemId));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Specification item removed', data: {} });
});

module.exports = { createTemplate, updateTemplate, deleteTemplate, getTemplate, listTemplates, addTemplateItem, removeTemplateItem };