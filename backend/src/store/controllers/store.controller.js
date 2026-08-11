const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const AppError = require('../../errors/AppError');
const errorCodes = require('../../constants/errorCodes');
const { validateStoreUpdateInput, validatePoliciesInput } = require('../validators/store.validator');
const service = require('../services/store.service');

// ---- Seller (identity from req.user.id only — no :id param) ----

const getMySellerProfile = asyncHandler(async (req, res) => {
  const seller = await service.getMySellerProfile(req.user.id);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Seller profile retrieved', data: { seller } });
});

const getMyStore = asyncHandler(async (req, res) => {
  const store = await service.getMyStore(req.user.id);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Store retrieved', data: { store } });
});

const updateMyStore = asyncHandler(async (req, res) => {
  const v = validateStoreUpdateInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const store = await service.updateMyStore(req.user.id, v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Store updated', data: { store } });
});

const updatePolicies = asyncHandler(async (req, res) => {
  const v = validatePoliciesInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const store = await service.upsertPolicies(req.user.id, v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Policies updated', data: { store } });
});

const updateMedia = asyncHandler(async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new AppError('No image files provided', httpStatus.BAD_REQUEST, errorCodes.VALIDATION_FAILED);
  }
  const store = await service.updateStoreMedia(req.user.id, req.files);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Store media updated', data: { store } });
});

// ---- Public ----

const getPublicStore = asyncHandler(async (req, res) => {
  const store = await service.getPublicStoreBySlug(req.params.slug);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Store retrieved', data: { store } });
});

// ---- Admin ----

const listStores = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listStores(req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Stores retrieved', data: { stores: items }, meta });
});

const getStore = asyncHandler(async (req, res) => {
  const store = await service.getStoreById(Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Store retrieved', data: { store } });
});

const suspendStore = asyncHandler(async (req, res) => {
  const store = await service.suspendStore(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Store suspended', data: { store } });
});

const activateStore = asyncHandler(async (req, res) => {
  const store = await service.activateStore(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Store activated', data: { store } });
});

const featureStore = asyncHandler(async (req, res) => {
  const isFeatured = req.body.isFeatured === true || req.body.isFeatured === 'true';
  const store = await service.featureStore(req.user.id, Number(req.params.id), isFeatured);
  sendSuccess(res, {
    statusCode: httpStatus.OK,
    message: isFeatured ? 'Store featured' : 'Store unfeatured',
    data: { store },
  });
});

module.exports = {
  getMySellerProfile, getMyStore, updateMyStore, updatePolicies, updateMedia,
  getPublicStore,
  listStores, getStore, suspendStore, activateStore, featureStore,
};