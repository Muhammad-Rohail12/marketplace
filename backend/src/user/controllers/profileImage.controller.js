const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const AppError = require('../../errors/AppError');
const errorCodes = require('../../constants/errorCodes');
const profileImageService = require('../services/profileImage.service');

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No image file provided', httpStatus.BAD_REQUEST, errorCodes.VALIDATION_FAILED);
  }

  const user = await profileImageService.uploadProfileImage(req.user.id, req.file);

  return sendSuccess(res, {
    statusCode: httpStatus.OK,
    message: 'Profile image updated',
    data: { user },
  });
});

const removeImage = asyncHandler(async (req, res) => {
  const user = await profileImageService.removeProfileImage(req.user.id);

  return sendSuccess(res, {
    statusCode: httpStatus.OK,
    message: 'Profile image removed',
    data: { user },
  });
});

module.exports = { uploadImage, removeImage };