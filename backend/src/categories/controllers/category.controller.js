const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const ValidationError = require('../../errors/ValidationError');
const { validateCategoryInput } = require('../validators/category.validator');
const categoryService = require('../services/category.service');
const treeService = require('../services/categoryTree.service');

const isAdmin = (req) => req.user?.role === 'ADMIN';

const createCategory = asyncHandler(async (req, res) => {
  const validation = validateCategoryInput(req.body, { isUpdate: false });
  if (!validation.isValid) throw new ValidationError('Validation failed', validation.errors);

  const category = await categoryService.createCategory(validation.data, req.files);

  return sendSuccess(res, { statusCode: httpStatus.CREATED, message: 'Category created', data: { category } });
});

const updateCategory = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const validation = validateCategoryInput(req.body, { isUpdate: true });
  if (!validation.isValid) throw new ValidationError('Validation failed', validation.errors);

  const category = await categoryService.updateCategory(id, validation.data, req.files);

  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Category updated', data: { category } });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await categoryService.softDeleteCategory(id);
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Category deleted', data: {} });
});

const restoreCategory = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const category = await categoryService.restoreCategory(id);
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Category restored', data: { category } });
});

const getCategory = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const category = await categoryService.getCategoryById(id, { includeInactive: isAdmin(req) });
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Category retrieved', data: { category } });
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug, { includeInactive: isAdmin(req) });
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Category retrieved', data: { category } });
});

const listCategories = asyncHandler(async (req, res) => {
  const admin = isAdmin(req);
  const { items, meta } = await categoryService.listCategories({
    page: req.query.page,
    limit: req.query.limit,
    search: req.query.search,
    parentId: req.query.parentId !== undefined ? (req.query.parentId === 'null' ? null : Number(req.query.parentId)) : undefined,
    sort: req.query.sort,
    includeInactive: admin && req.query.includeInactive === 'true',
    includeDeleted: admin && req.query.includeDeleted === 'true',
  });

  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Categories retrieved', data: { categories: items }, meta });
});

const getTree = asyncHandler(async (req, res) => {
  const tree = await categoryService.getTree({ includeInactive: isAdmin(req) && req.query.includeInactive === 'true' });
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Category tree retrieved', data: { tree } });
});

const getChildren = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const children = await categoryService.getChildren(id);
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Child categories retrieved', data: { children } });
});

const getBreadcrumb = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const breadcrumb = await treeService.getBreadcrumb(id);
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Breadcrumb retrieved', data: { breadcrumb } });
});

const getFeatured = asyncHandler(async (req, res) => {
  const categories = await categoryService.getFeatured();
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Featured categories retrieved', data: { categories } });
});

const getHomepage = asyncHandler(async (req, res) => {
  const categories = await categoryService.getHomepage();
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Homepage categories retrieved', data: { categories } });
});

const getNavigation = asyncHandler(async (req, res) => {
  const tree = await categoryService.getNavigation();
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Navigation categories retrieved', data: { tree } });
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
  getCategory,
  getCategoryBySlug,
  listCategories,
  getTree,
  getChildren,
  getBreadcrumb,
  getFeatured,
  getHomepage,
  getNavigation,
};