const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const validators = require('../validators/inventory.validator');
const service = require('../services/inventory.service');

// ---- Seller ----

const createInventory = asyncHandler(async (req, res) => {
  const v = validators.validateCreateInventoryInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const inventory = await service.createInventory(req.user.id, Number(req.params.productId), v.data);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Inventory created', data: { inventory } });
});

const listMyInventory = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listMyInventory(req.user.id, req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Inventory retrieved', data: { inventory: items }, meta });
});

const getSummary = asyncHandler(async (req, res) => {
  const summary = await service.getSummary(req.user.id);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Inventory summary retrieved', data: { summary } });
});

const getInventoryDetail = asyncHandler(async (req, res) => {
  const inventory = await service.getInventoryDetail(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Inventory retrieved', data: { inventory } });
});

const adjustStock = asyncHandler(async (req, res) => {
  const v = validators.validateAdjustmentInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const inventory = await service.adjustStock(req.user.id, Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Stock adjusted', data: { inventory } });
});

const restock = asyncHandler(async (req, res) => {
  const v = validators.validateRestockInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const inventory = await service.restockInventory(req.user.id, Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Restocked successfully', data: { inventory } });
});

const updateThreshold = asyncHandler(async (req, res) => {
  const v = validators.validateThresholdInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const inventory = await service.updateThreshold(req.user.id, Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Threshold updated', data: { inventory } });
});

const getStockHistory = asyncHandler(async (req, res) => {
  const { items, meta } = await service.getStockHistory(req.user.id, Number(req.params.id), req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Stock history retrieved', data: { movements: items }, meta });
});

// ---- Admin ----

const listAllInventory = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listAllInventory(req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Inventory retrieved', data: { inventory: items }, meta });
});

const adminAdjustStock = asyncHandler(async (req, res) => {
  const v = validators.validateAdjustmentInput(req.body, { requireReason: true });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const inventory = await service.adminAdjustStock(req.user.id, Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Stock adjusted by admin', data: { inventory } });
});

const adminGetStockHistory = asyncHandler(async (req, res) => {
  const { items, meta } = await service.adminGetStockHistory(Number(req.params.id), req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Stock history retrieved', data: { movements: items }, meta });
});

// ---- Public ----

const getProductAvailability = asyncHandler(async (req, res) => {
  const availability = await service.getProductAvailability(Number(req.params.productId));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Availability retrieved', data: { availability } });
});

const getVariantAvailability = asyncHandler(async (req, res) => {
  const availability = await service.getVariantAvailability(Number(req.params.variantId));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Availability retrieved', data: { availability } });
});

module.exports = {
  createInventory, listMyInventory, getSummary, getInventoryDetail, adjustStock, restock, updateThreshold, getStockHistory,
  listAllInventory, adminAdjustStock, adminGetStockHistory,
  getProductAvailability, getVariantAvailability,
};