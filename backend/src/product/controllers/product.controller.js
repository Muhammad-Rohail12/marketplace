const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const validators = require('../validators/product.validator');
const service = require('../services/product.service');

// ---- Seller ----

const createProduct = asyncHandler(async (req, res) => {
  const v = validators.validateProductInput(req.body, { isCreate: true });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const product = await service.createProduct(req.user.id, v.data);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Product created', data: { product } });
});

const listMyProducts = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listMyProducts(req.user.id, req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Products retrieved', data: { products: items }, meta });
});

const getMyProduct = asyncHandler(async (req, res) => {
  const product = await service.getOwnedProduct(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Product retrieved', data: { product } });
});

const updateProduct = asyncHandler(async (req, res) => {
  const v = validators.validateProductInput(req.body, { isCreate: false });
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const product = await service.updateProduct(req.user.id, Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Product updated', data: { product } });
});

const updateAttributes = asyncHandler(async (req, res) => {
  const v = validators.validateAttributeValuesInput(req.body);
  const result = await service.upsertAttributeValues(req.user.id, Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Attributes updated', data: result });
});

const updateSpecifications = asyncHandler(async (req, res) => {
  const v = validators.validateSpecificationsInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const product = await service.upsertSpecifications(req.user.id, Number(req.params.id), v.data);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Specifications updated', data: { product } });
});

const createVariant = asyncHandler(async (req, res) => {
  const v = validators.validateVariantCombinationInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const variant = await service.createVariant(req.user.id, Number(req.params.id), v.data, v.optionIds);
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Variant created', data: { variant } });
});

const updateVariant = asyncHandler(async (req, res) => {
  const v = validators.validateVariantCombinationInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const variant = await service.updateVariant(req.user.id, Number(req.params.id), Number(req.params.variantId), v.data, v.optionIds);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Variant updated', data: { variant } });
});

const deleteVariant = asyncHandler(async (req, res) => {
  await service.deleteVariant(req.user.id, Number(req.params.id), Number(req.params.variantId));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Variant deleted', data: {} });
});

const submitProduct = asyncHandler(async (req, res) => {
  const product = await service.submitProduct(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Product submitted for review', data: { product } });
});

const archiveProduct = asyncHandler(async (req, res) => {
  const product = await service.archiveProduct(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Product archived', data: { product } });
});

const duplicateProduct = asyncHandler(async (req, res) => {
  const product = await service.duplicateProduct(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Product duplicated', data: { product } });
});

// ---- Admin ----

const listAllProducts = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listAllProducts(req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Products retrieved', data: { products: items }, meta });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await service.getProductForAdmin(Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Product retrieved', data: { product } });
});

const approveProduct = asyncHandler(async (req, res) => {
  const product = await service.approveProduct(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Product approved', data: { product } });
});

const rejectProduct = asyncHandler(async (req, res) => {
  const v = validators.validateRejectionInput(req.body);
  if (!v.isValid) throw new ValidationError('Validation failed', v.errors);
  const product = await service.rejectProduct(req.user.id, Number(req.params.id), v.data.rejectionReason);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Product rejected', data: { product } });
});

const deactivateProduct = asyncHandler(async (req, res) => {
  const product = await service.deactivateProduct(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Product deactivated', data: { product } });
});

const adminArchiveProduct = asyncHandler(async (req, res) => {
  const product = await service.adminArchiveProduct(req.user.id, Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Product archived', data: { product } });
});

// ---- Public ----

const getPublicProduct = asyncHandler(async (req, res) => {
  const product = await service.getPublicProductBySlug(req.params.slug);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Product retrieved', data: { product } });
});

const listByCategory = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listPublicByCategory(req.params.categoryId, req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Products retrieved', data: { products: items }, meta });
});

const listByBrand = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listPublicByBrand(req.params.brandId, req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Products retrieved', data: { products: items }, meta });
});

// ADD this controller alongside the existing listByCategory / listByBrand:

const listByStore = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listPublicByStore(req.params.storeId, req.query);
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Products retrieved', data: { products: items }, meta });
});

// ADD listByStore to the module.exports object alongside the existing exports.

const getRelated = asyncHandler(async (req, res) => {
  const products = await service.getRelatedProducts(Number(req.params.id));
  sendSuccess(res, { statusCode: httpStatus.OK, message: 'Related products retrieved', data: { products } });
});

module.exports = {
  createProduct, listMyProducts, getMyProduct, updateProduct, updateAttributes, updateSpecifications,
  createVariant, updateVariant, deleteVariant, submitProduct, archiveProduct, duplicateProduct,
  listAllProducts, getProduct, approveProduct, rejectProduct, deactivateProduct, adminArchiveProduct,
  getPublicProduct, listByCategory, listByBrand, listByStore, getRelated,
};