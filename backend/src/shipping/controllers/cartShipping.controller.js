const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const { validateSelectShippingInput } = require('../validators/cartShipping.validator');
const cartShippingService = require('../services/cartShipping.service');
const cartService = require('../../cart/services/cart.service');

const selectShipping = asyncHandler(async (req, res) => {
  const v = validateSelectShippingInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  await cartShippingService.selectShippingForGroup(req.user.id, v.data);
  const result = await cartService.buildCartResponse(req.user.id);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Shipping method selected', data: result });
});

module.exports = { selectShipping };