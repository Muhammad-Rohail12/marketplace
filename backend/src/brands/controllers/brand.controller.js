const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const { validateBrandInput } = require('../validators/brand.validator');
const brandService = require('../services/brand.service');

const isAdmin = (req) => req.user?.role === 'ADMIN';

const createBrand = asyncHandler(async (req, res) => {
  const validation = validateBrandInput(req.body, { isUpdate: false });
  if (!validation.isValid) throw new ValidationError('Validation failed', validation.errors);

  const brand = await brandService.createBrand(validation.data, req.files);
  return sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Brand created', data: { brand } });
});

const updateBrand = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const validation = validateBrandInput(req.body, { isUpdate: true });
  if (!validation.isValid) throw new ValidationError('Validation failed', validation.errors);

  const brand = await brandService.updateBrand(id, validation.data, req.files);
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Brand updated', data: { brand } });
});

const deleteBrand = asyncHandler(async (req, res) => {
  await brandService.softDeleteBrand(Number(req.params.id));
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Brand deleted', data: {} });
});

const restoreBrand = asyncHandler(async (req, res) => {
  const brand = await brandService.restoreBrand(Number(req.params.id));
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Brand restored', data: { brand } });
});

const getBrand = asyncHandler(async (req, res) => {
  const brand = await brandService.getBrandById(Number(req.params.id), { includeInactive: isAdmin(req) });
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Brand retrieved', data: { brand } });
});

const getBrandBySlug = asyncHandler(async (req, res) => {
  const brand = await brandService.getBrandBySlug(req.params.slug, { includeInactive: isAdmin(req) });
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Brand retrieved', data: { brand } });
});

const listBrands = asyncHandler(async (req, res) => {
  const admin = isAdmin(req);
  const { items, meta } = await brandService.listBrands({
    page: req.query.page,
    limit: req.query.limit,
    search: req.query.search,
    country: req.query.country,
    isVerified: req.query.isVerified,
    sort: req.query.sort,
    includeInactive: admin && req.query.includeInactive === 'true',
    includeDeleted: admin && req.query.includeDeleted === 'true',
  });
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Brands retrieved', data: { brands: items }, meta });
});

const getFeatured = asyncHandler(async (req, res) => {
  const brands = await brandService.getFeatured();
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Featured brands retrieved', data: { brands } });
});

const getHomepage = asyncHandler(async (req, res) => {
  const brands = await brandService.getHomepage();
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Homepage brands retrieved', data: { brands } });
});

const getVerified = asyncHandler(async (req, res) => {
  const brands = await brandService.getVerified();
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Verified brands retrieved', data: { brands } });
});

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  restoreBrand,
  getBrand,
  getBrandBySlug,
  listBrands,
  getFeatured,
  getHomepage,
  getVerified,
};