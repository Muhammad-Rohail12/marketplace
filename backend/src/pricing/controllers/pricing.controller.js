const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const validators = require('../validators/pricing.validator');
const priceService = require('../services/price.service');
const discountService = require('../services/discount.service');
const pricingEngine = require('../services/pricingEngine.service');

// ---- Seller: Price ----

const createPrice = asyncHandler(async (req, res) => {
  const v = validators.validatePriceInput(req.body, { isCreate: true });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const price = await priceService.createPrice(req.user.id, Number(req.params.productId), v.data);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Price created', data: { price } });
});

const updatePrice = asyncHandler(async (req, res) => {
  const v = validators.validatePriceInput(req.body, { isCreate: false });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const price = await priceService.updatePrice(req.user.id, Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Price updated', data: { price } });
});

const getMyPrice = asyncHandler(async (req, res) => {
  const price = await priceService.getMyPrice(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Price retrieved', data: { price } });
});

const listMyPricing = asyncHandler(async (req, res) => {
  const { items, meta } = await priceService.listMyPricing(req.user.id, req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Pricing retrieved', data: { pricing: items }, meta });
});

const getPriceHistory = asyncHandler(async (req, res) => {
  const { items, meta } = await priceService.getPriceHistory(req.user.id, Number(req.params.id), req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Price history retrieved', data: { history: items }, meta });
});

// ---- Seller: Discounts ----

const createDiscount = asyncHandler(async (req, res) => {
  const v = validators.validateDiscountInput(req.body, { isCreate: true });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const discount = await discountService.createDiscount(req.user.id, Number(req.params.priceId), v.data);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Discount created', data: { discount } });
});

const updateDiscount = asyncHandler(async (req, res) => {
  const v = validators.validateDiscountInput(req.body, { isCreate: false });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const discount = await discountService.updateDiscount(req.user.id, Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Discount updated', data: { discount } });
});

const deleteDiscount = asyncHandler(async (req, res) => {
  await discountService.deleteDiscount(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Discount removed', data: {} });
});

const listDiscounts = asyncHandler(async (req, res) => {
  const discounts = await discountService.listDiscountsForPrice(req.user.id, Number(req.params.priceId));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Discounts retrieved', data: { discounts } });
});

// ---- Seller: Deals ----

const createDeal = asyncHandler(async (req, res) => {
  const v = validators.validateDealInput(req.body, { isCreate: true });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const deal = await discountService.createDeal(req.user.id, v.data);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Deal created', data: { deal } });
});

const listMyDeals = asyncHandler(async (req, res) => {
  const deals = await discountService.listMyDeals(req.user.id);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Deals retrieved', data: { deals } });
});

const getDeal = asyncHandler(async (req, res) => {
  const deal = await discountService.getOwnedDeal(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Deal retrieved', data: { deal } });
});

const addProductToDeal = asyncHandler(async (req, res) => {
  const { productId, variantId, priceId, type, value } = req.body;
  const v = validators.validateDiscountInput({ type, value }, { isCreate: true });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const discount = await discountService.addProductToDeal(req.user.id, Number(req.params.id), {
    productId: Number(productId), variantId: variantId ? Number(variantId) : null, priceId: Number(priceId), type: v.data.type, value: v.data.value,
  });
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Product added to deal', data: { discount } });
});

const removeProductFromDeal = asyncHandler(async (req, res) => {
  await discountService.removeProductFromDeal(req.user.id, Number(req.params.discountId));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Product removed from deal', data: {} });
});

const setDealEnabled = asyncHandler(async (req, res) => {
  const isEnabled = req.body.isEnabled === true || req.body.isEnabled === 'true';
  const deal = await discountService.setDealEnabled(req.user.id, Number(req.params.id), isEnabled);
  sendSuccess(res, { statusCode: httpStatus.OK, message: isEnabled ? 'Deal enabled' : 'Deal disabled', data: { deal } });
});

// ---- Admin ----

const listAllPricing = asyncHandler(async (req, res) => {
  const { items, meta } = await priceService.listAllPricing(req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Pricing retrieved', data: { pricing: items }, meta });
});

const adminAdjustPrice = asyncHandler(async (req, res) => {
  const priceV = validators.validatePriceInput({ basePrice: req.body.basePrice }, { isCreate: false });
  const reasonV = validators.validateAdminAdjustmentInput(req.body);
  if (!priceV.isValid || !reasonV.isValid) throw new ValidationError('Validation failed', [...priceV.errors, ...reasonV.errors]);
  const price = await priceService.adminAdjustPrice(req.user.id, Number(req.params.id), { basePrice: priceV.data.basePrice, reason: reasonV.data.reason });
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Price adjusted by admin', data: { price } });
});

// ---- Public ----

const getProductPricing = asyncHandler(async (req, res) => {
  const pricing = await pricingEngine.getPublicProductPricing(Number(req.params.productId));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Pricing retrieved', data: { pricing } });
});

const getVariantPricing = asyncHandler(async (req, res) => {
  const pricing = await pricingEngine.getPublicVariantPricing(Number(req.params.variantId));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Pricing retrieved', data: { pricing } });
});

const getPricingBatch = asyncHandler(async (req, res) => {
  const ids = (req.query.productIds || '').split(',').map(Number).filter((n) => !isNaN(n)).slice(0, 50);
  const pricing = await pricingEngine.getPublicPricingBatch(ids);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Pricing retrieved', data: { pricing } });
});

module.exports = {
  createPrice, updatePrice, getMyPrice, listMyPricing, getPriceHistory,
  createDiscount, updateDiscount, deleteDiscount, listDiscounts,
  createDeal, listMyDeals, getDeal, addProductToDeal, removeProductFromDeal, setDealEnabled,
  listAllPricing, adminAdjustPrice,
  getProductPricing, getVariantPricing, getPricingBatch,
};