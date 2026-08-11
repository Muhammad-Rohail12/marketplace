const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const AppError = require('../../errors/AppError');
const ValidationError = require('../../errors/ValidationError');
const errorCodes = require('../../constants/errorCodes');
const { validateMediaMetadataInput, validateReorderInput } = require('../validators/media.validator');
const service = require('../services/media.service');

const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError('No image files provided', httpStatus.BAD_REQUEST, errorCodes.VALIDATION_FAILED);
  }
  const variantId = req.body.variantId ? Number(req.body.variantId) : undefined;
  const media = await service.uploadMedia(req.user.id, Number(req.params.id), req.files, { variantId });
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Media uploaded', data: { media } });
});

const listMedia = asyncHandler(async (req, res) => {
  const media = await service.listMediaForOwner(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Media retrieved', data: { media } });
});

const updateMetadata = asyncHandler(async (req, res) => {
  const v = validateMediaMetadataInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const media = await service.updateMediaMetadata(req.user.id, Number(req.params.id), Number(req.params.mediaId), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Media updated', data: { media } });
});

const setPrimary = asyncHandler(async (req, res) => {
  const media = await service.setPrimary(req.user.id, Number(req.params.id), Number(req.params.mediaId));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Primary image set', data: { media } });
});

const reorderMedia = asyncHandler(async (req, res) => {
  const v = validateReorderInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const media = await service.reorderMedia(req.user.id, Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Media reordered', data: { media } });
});

const deleteMedia = asyncHandler(async (req, res) => {
  await service.deleteMedia(req.user.id, Number(req.params.id), Number(req.params.mediaId));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Media deleted', data: {} });
});

const replaceMedia = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError('No replacement file provided', httpStatus.BAD_REQUEST, errorCodes.VALIDATION_FAILED);
  }
  const media = await service.replaceMedia(req.user.id, Number(req.params.id), Number(req.params.mediaId), req.files[0]);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Media replaced', data: { media } });
});

const getPublicMedia = asyncHandler(async (req, res) => {
  const media = await service.getPublicMediaForProduct(Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Media retrieved', data: { media } });
});

const adminDeleteMedia = asyncHandler(async (req, res) => {
  await service.adminDeleteMedia(req.user.id, Number(req.params.id), Number(req.params.mediaId));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Media removed', data: {} });
});

module.exports = { uploadMedia, listMedia, updateMetadata, setPrimary, reorderMedia, deleteMedia, replaceMedia, getPublicMedia, adminDeleteMedia };