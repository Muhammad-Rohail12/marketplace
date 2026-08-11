const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const validators = require('../validators/cart.validator');
const service = require('../services/cart.service');

const getCart = asyncHandler(async (req, res) => {
  const result = await service.buildCartResponse(req.user.id);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Cart retrieved', data: result });
});

const addItem = asyncHandler(async (req, res) => {
  const v = validators.validateAddItemInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  await service.addItem(req.user.id, v.data);
  const result = await service.buildCartResponse(req.user.id);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Item added to cart', data: result });
});

const updateItem = asyncHandler(async (req, res) => {
  const v = validators.validateUpdateQuantityInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  await service.updateItemQuantity(req.user.id, Number(req.params.itemId), v.data.quantity);
  const result = await service.buildCartResponse(req.user.id);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Cart item updated', data: result });
});

const removeItem = asyncHandler(async (req, res) => {
  await service.removeItem(req.user.id, Number(req.params.itemId));
  const result = await service.buildCartResponse(req.user.id);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Item removed from cart', data: result });
});

const clearCart = asyncHandler(async (req, res) => {
  await service.clearCart(req.user.id);
  const result = await service.buildCartResponse(req.user.id);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Cart cleared', data: result });
});

const validateCart = asyncHandler(async (req, res) => {
  const result = await service.validateCart(req.user.id);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Cart validated', data: result });
});

const getCount = asyncHandler(async (req, res) => {
  const count = await service.getCartItemCount(req.user.id);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Cart count retrieved', data: { count } });
});

module.exports = { getCart, addItem, updateItem, removeItem, clearCart, validateCart, getCount };