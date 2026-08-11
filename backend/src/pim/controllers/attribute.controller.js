const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const validators = require('../validators/attribute.validator');
const service = require('../services/attribute.service');

// Attribute Groups
const createAttributeGroup = asyncHandler(async (req, res) => {
  const v = validators.validateAttributeGroupInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const group = await service.createAttributeGroup(v.data);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Attribute group created', data: { group } });
});

const updateAttributeGroup = asyncHandler(async (req, res) => {
  const v = validators.validateAttributeGroupInput(req.body, { isUpdate: true });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const group = await service.updateAttributeGroup(Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Attribute group updated', data: { group } });
});

const deleteAttributeGroup = asyncHandler(async (req, res) => {
  await service.deleteAttributeGroup(Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Attribute group deleted', data: {} });
});

const listAttributeGroups = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listAttributeGroups(req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Attribute groups retrieved', data: { groups: items }, meta });
});

// Attributes
const createAttribute = asyncHandler(async (req, res) => {
  const v = validators.validateAttributeInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const attribute = await service.createAttribute(v.data);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Attribute created', data: { attribute } });
});

const updateAttribute = asyncHandler(async (req, res) => {
  const v = validators.validateAttributeInput(req.body, { isUpdate: true });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const attribute = await service.updateAttribute(Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Attribute updated', data: { attribute } });
});

const deleteAttribute = asyncHandler(async (req, res) => {
  await service.deleteAttribute(Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Attribute deleted', data: {} });
});

const getAttribute = asyncHandler(async (req, res) => {
  const attribute = await service.getAttributeById(Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Attribute retrieved', data: { attribute } });
});

const listAttributes = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listAttributes(req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Attributes retrieved', data: { attributes: items }, meta });
});

// Attribute Values
const createAttributeValue = asyncHandler(async (req, res) => {
  const v = validators.validateAttributeValueInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const value = await service.createAttributeValue(Number(req.params.attributeId), v.data);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Attribute value created', data: { value } });
});

const updateAttributeValue = asyncHandler(async (req, res) => {
  const v = validators.validateAttributeValueInput(req.body, { isUpdate: true });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const value = await service.updateAttributeValue(Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Attribute value updated', data: { value } });
});

const deleteAttributeValue = asyncHandler(async (req, res) => {
  await service.deleteAttributeValue(Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Attribute value deleted', data: {} });
});

const listAttributeValues = asyncHandler(async (req, res) => {
  const values = await service.listAttributeValues(Number(req.params.attributeId));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Attribute values retrieved', data: { values } });
});

// Category Attribute Assignments
const assignCategoryAttribute = asyncHandler(async (req, res) => {
  const v = validators.validateCategoryAttributeInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const assignment = await service.assignCategoryAttribute(v.data);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Attribute assigned to category', data: { assignment } });
});

const removeCategoryAttribute = asyncHandler(async (req, res) => {
  await service.removeCategoryAttribute(Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Attribute assignment removed', data: {} });
});

const listCategoryAttributes = asyncHandler(async (req, res) => {
  const assignments = await service.listCategoryAttributes(req.params.categoryId);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Category attributes retrieved', data: { assignments } });
});

module.exports = {
  createAttributeGroup, updateAttributeGroup, deleteAttributeGroup, listAttributeGroups,
  createAttribute, updateAttribute, deleteAttribute, getAttribute, listAttributes,
  createAttributeValue, updateAttributeValue, deleteAttributeValue, listAttributeValues,
  assignCategoryAttribute, removeCategoryAttribute, listCategoryAttributes,
};