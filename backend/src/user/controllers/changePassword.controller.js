const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const { validateChangePasswordInput } = require('../validators/changePassword.validator');
const { changePassword: changePasswordService } = require('../services/changePassword.service');

const changePassword = asyncHandler(async (req, res) => {
  const validation = validateChangePasswordInput(req.body);

  if (!validation.isValid) {
    throw new ValidationError('Validation failed', validation.errors);
  }

  await changePasswordService(req.user.id, validation.data);

  return sendSuccess(res, {
    statusCode: httpStatus.OK,
    message: 'Password changed successfully. Please log in again on other devices.',
    data: {},
  });
});

module.exports = { changePassword };