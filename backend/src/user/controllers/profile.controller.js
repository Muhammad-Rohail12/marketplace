const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const { validateUpdateProfileInput } = require('../validators/profile.validator');
const profileService = require('../services/profile.service');

const getMyProfile = asyncHandler(async (req, res) => {
  const user = await profileService.getProfile(req.user.id);
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Profile retrieved', data: { user } });
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const validation = validateUpdateProfileInput(req.body);

  if (!validation.isValid) {
    throw new ValidationError('Validation failed', validation.errors);
  }

  const user = await profileService.updateProfile(req.user.id, validation.data);

  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Profile updated successfully', data: { user } });
});

module.exports = { getMyProfile, updateMyProfile };