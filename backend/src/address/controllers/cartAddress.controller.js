const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const { validateSelectAddressInput } = require('../validators/address.validator');
const cartAddressService = require('../services/cartAddress.service');
const cartService = require('../../cart/services/cart.service');

const selectCartAddress = asyncHandler(async (req, res) => {
  const v = validateSelectAddressInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  await cartAddressService.selectCartAddress(req.user.id, v.data.addressId);
  const result = await cartService.buildCartResponse(req.user.id);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Delivery address selected', data: result });
});

module.exports = { selectCartAddress };