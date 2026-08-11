const fs = require('fs/promises');
const path = require('path');
const prisma = require('../../database/prismaClient');
const { generateUniqueSlug } = require('../utils/slug.util');
const treeService = require('./categoryTree.service');
const { UPLOAD_DIR } = require('../middlewares/uploadCategoryImages.middleware');
const { marketplace } = { marketplace: require('../../marketplace') };
const NotFoundError = require('../../errors/NotFoundError');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');
const CATEGORY = require('../constants/category.constants');
const logger = require('../../utils/logger');

const PUBLIC_PATH_PREFIX = '/uploads/category-images';

const assertUniqueNameAmongSiblings = async (name, parentId, excludeId = null) => {
  const existing = await prisma.category.findFirst({
    where: {
      name: { equals: name, mode: 'insensitive' },
      parentId: parentId ?? null,
      deletedAt: null,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });
  if (existing) {
    throw new AppError(
      'A category with this name already exists at this level',
      httpStatus.CONFLICT,
      errorCodes.DUPLICATE_NAME
    );
  }
};

const deleteFileIfExists = async (relativePath) => {
  if (!relativePath) return;
  const filename = path.basename(relativePath);
  const fullPath = path.join(UPLOAD_DIR, filename);
  try {
    await fs.unlink(fullPath);
  } catch (err) {
    if (err.code !== 'ENOENT') logger.warn('Failed to delete category image:', err.message);
  }
};

const applyUploadedFiles = (data, files) => {
  if (!files) return data;
  if (files.icon?.[0]) data.icon = `${PUBLIC_PATH_PREFIX}/${files.icon[0].filename}`;
  if (files.image?.[0]) data.image = `${PUBLIC_PATH_PREFIX}/${files.image[0].filename}`;
  if (files.banner?.[0]) data.banner = `${PUBLIC_PATH_PREFIX}/${files.banner[0].filename}`;
  return data;
};

const createCategory = async (input, files) => {
  await assertUniqueNameAmongSiblings(input.name, input.parentId ?? null);

  const level = await treeService.computeLevel(input.parentId ?? null);
  const slug = await generateUniqueSlug(input.name);

  const data = applyUploadedFiles({ ...input, slug, level }, files);

  return prisma.category.create({ data });
};

const updateCategory = async (id, input, files) => {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing || existing.deletedAt) {
    throw new NotFoundError('Category not found', errorCodes.CATEGORY_NOT_FOUND);
  }

  const data = { ...input };

  if (data.parentId !== undefined && data.parentId !== existing.parentId) {
    await treeService.assertNoCircularReference(id, data.parentId);
    data.level = await treeService.computeLevel(data.parentId);
  }

  if (data.name && data.name !== existing.name) {
    const parentIdForCheck = data.parentId !== undefined ? data.parentId : existing.parentId;
    await assertUniqueNameAmongSiblings(data.name, parentIdForCheck, id);
  }

  applyUploadedFiles(data, files);

  // Replace old images on disk when new ones are uploaded.
  if (data.icon && existing.icon && data.icon !== existing.icon) await deleteFileIfExists(existing.icon);
  if (data.image && existing.image && data.image !== existing.image) await deleteFileIfExists(existing.image);
  if (data.banner && existing.banner && data.banner !== existing.banner) await deleteFileIfExists(existing.banner);

  return prisma.category.update({ where: { id }, data });
};

const softDeleteCategory = async (id) => {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing || existing.deletedAt) {
    throw new NotFoundError('Category not found', errorCodes.CATEGORY_NOT_FOUND);
  }

  // Soft-delete this category and every descendant together, so a
  // deleted branch doesn't leave orphaned "active" children still
  // publicly visible under a deleted parent.
  const descendantIds = await treeService.getDescendantIds(id);
  const now = new Date();

  await prisma.category.updateMany({
    where: { id: { in: [id, ...descendantIds] } },
    data: { deletedAt: now, isActive: false },
  });
};

const restoreCategory = async (id) => {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing || !existing.deletedAt) {
    throw new NotFoundError('Deleted category not found', errorCodes.CATEGORY_NOT_FOUND);
  }

  // Only restores the category itself, not its descendants — admin
  // reviews and restores children individually, avoiding surprise
  // mass-reactivation of a whole branch.
  return prisma.category.update({ where: { id }, data: { deletedAt: null, isActive: true } });
};

const getCategoryById = async (id, { includeInactive = false } = {}) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category || category.deletedAt || (!includeInactive && !category.isActive)) {
    throw new NotFoundError('Category not found', errorCodes.CATEGORY_NOT_FOUND);
  }
  return category;
};

const getCategoryBySlug = async (slug, { includeInactive = false } = {}) => {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category || category.deletedAt || (!includeInactive && !category.isActive)) {
    throw new NotFoundError('Category not found', errorCodes.CATEGORY_NOT_FOUND);
  }
  return category;
};

const listCategories = async ({ page, limit, search, parentId, includeInactive, includeDeleted, sort } = {}) => {
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { resolveSort } = marketplace.helpers.sorting;

  const { skip, take, page: safePage, limit: safeLimit } = resolvePagination({ page, limit });
  const orderBy = resolveSort(sort, CATEGORY.ALLOWED_SORT_FIELDS, 'sortOrder');

  const where = {
    ...(includeDeleted ? {} : { deletedAt: null }),
    ...(includeInactive ? {} : { isActive: true }),
    ...(parentId !== undefined ? { parentId: parentId === null ? null : Number(parentId) } : {}),
    ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
  };

  const [items, totalCount] = await Promise.all([
    prisma.category.findMany({ where, orderBy, skip, take }),
    prisma.category.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta({ page: safePage, limit: safeLimit, totalCount }) };
};

const getTree = async ({ includeInactive = false } = {}) => {
  const categories = await prisma.category.findMany({
    where: { deletedAt: null, ...(includeInactive ? {} : { isActive: true }) },
  });
  return treeService.buildTree(categories);
};

const getChildren = async (id) => {
  return prisma.category.findMany({
    where: { parentId: id, deletedAt: null, isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
};

const getFeatured = async () => {
  return prisma.category.findMany({
    where: { isFeatured: true, isActive: true, deletedAt: null },
    orderBy: { sortOrder: 'asc' },
  });
};

const getHomepage = async () => {
  return prisma.category.findMany({
    where: { showOnHomepage: true, isActive: true, deletedAt: null },
    orderBy: { sortOrder: 'asc' },
  });
};

const getNavigation = async () => {
  const categories = await prisma.category.findMany({
    where: { showInNavigation: true, isActive: true, deletedAt: null },
    orderBy: { sortOrder: 'asc' },
  });
  // Navigation is typically rendered as a tree too (top-level with
  // dropdown children), so build it the same way as the full tree.
  return treeService.buildTree(categories);
};

module.exports = {
  createCategory,
  updateCategory,
  softDeleteCategory,
  restoreCategory,
  getCategoryById,
  getCategoryBySlug,
  listCategories,
  getTree,
  getChildren,
  getFeatured,
  getHomepage,
  getNavigation,
};