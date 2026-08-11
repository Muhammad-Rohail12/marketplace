const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const { validateRegisterInput } = require('../validators/register.validator');
const { registerUser } = require('../services/register.service');

const register = asyncHandler(async (req, res) => {
  const validation = validateRegisterInput(req.body);

  if (!validation.isValid) {
    throw new ValidationError('Validation failed', validation.errors);
  }

  const user = await registerUser(validation.data);

  return sendSuccess(res, {
    statusCode: httpStatus.CREATED,
    message: 'Registration successful. Please check your email to verify your account.',
    data: { user },
  });
});

module.exports = { register };