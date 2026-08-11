const fs = require('fs/promises');
const path = require('path');
const prisma = require('../../database/prismaClient');
const marketplace = require('../../marketplace');
const { uploadBrandImages: _unused, LOGO_DIR, BANNER_DIR } = require('../middlewares/uploadBrandImages.middleware');
const NotFoundError = require('../../errors/NotFoundError');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');
const BRAND = require('../constants/brand.constants');
const logger = require('../../utils/logger');

const LOGO_PATH_PREFIX = '/uploads/brand-logos';
const BANNER_PATH_PREFIX = '/uploads/brand-banners';

const assertUniqueName = async (name, excludeId = null) => {
  const existing = await prisma.brand.findFirst({
    where: {
      name: { equals: name, mode: 'insensitive' },
      deletedAt: null,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });
  if (existing) {
    throw new AppError('A brand with this name already exists', httpStatus.CONFLICT, errorCodes.DUPLICATE_NAME);
  }
};

const deleteFile = async (relativePath, dir) => {
  if (!relativePath) return;
  const filename = path.basename(relativePath);
  const fullPath = path.join(dir, filename);
  try {
    await fs.unlink(fullPath);
  } catch (err) {
    if (err.code !== 'ENOENT') logger.warn('Failed to delete brand image:', err.message);
  }
};

const applyUploadedFiles = (data, files) => {
  if (!files) return data;
  if (files.logo?.[0]) data.logo = `${LOGO_PATH_PREFIX}/${files.logo[0].filename}`;
  if (files.banner?.[0]) data.banner = `${BANNER_PATH_PREFIX}/${files.banner[0].filename}`;
  return data;
};

const createBrand = async (input, files) => {
  await assertUniqueName(input.name);
  const slug = await marketplace.helpers.slug.generateSlug
    ? uniqueSlugFor(input.name)
    : null;
  const finalSlug = await uniqueSlugFor(input.name);

  const data = applyUploadedFiles({ ...input, slug: finalSlug }, files);
  return prisma.brand.create({ data });
};

// Local slug-uniqueness helper (brand-scoped), reusing the Phase 16
// slug generator for normalization only.
async function uniqueSlugFor(name, excludeId = null) {
  const base = marketplace.helpers.slug.generateSlug(name);
  let slug = base;
  let suffix = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.brand.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    if (!existing) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}

const updateBrand = async (id, input, files) => {
  const existing = await prisma.brand.findUnique({ where: { id } });
  if (!existing || existing.deletedAt) {
    throw new NotFoundError('Brand not found', errorCodes.BRAND_NOT_FOUND);
  }

  const data = { ...input };

  if (data.name && data.name !== existing.name) {
    await assertUniqueName(data.name, id);
    data.slug = await uniqueSlugFor(data.name, id);
  }

  applyUploadedFiles(data, files);

  if (data.logo && existing.logo && data.logo !== existing.logo) await deleteFile(existing.logo, LOGO_DIR);
  if (data.banner && existing.banner && data.banner !== existing.banner) await deleteFile(existing.banner, BANNER_DIR);

  return prisma.brand.update({ where: { id }, data });
};

const softDeleteBrand = async (id) => {
  const existing = await prisma.brand.findUnique({ where: { id } });
  if (!existing || existing.deletedAt) {
    throw new NotFoundError('Brand not found', errorCodes.BRAND_NOT_FOUND);
  }
  await prisma.brand.update({ where: { id }, data: { deletedAt: new Date(), status: 'INACTIVE' } });
};

const restoreBrand = async (id) => {
  const existing = await prisma.brand.findUnique({ where: { id } });
  if (!existing || !existing.deletedAt) {
    throw new NotFoundError('Deleted brand not found', errorCodes.BRAND_NOT_FOUND);
  }
  return prisma.brand.update({ where: { id }, data: { deletedAt: null, status: 'ACTIVE' } });
};

const getBrandById = async (id, { includeInactive = false } = {}) => {
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand || brand.deletedAt || (!includeInactive && brand.status !== 'ACTIVE')) {
    throw new NotFoundError('Brand not found', errorCodes.BRAND_NOT_FOUND);
  }
  return brand;
};

const getBrandBySlug = async (slug, { includeInactive = false } = {}) => {
  const brand = await prisma.brand.findUnique({ where: { slug } });
  if (!brand || brand.deletedAt || (!includeInactive && brand.status !== 'ACTIVE')) {
    throw new NotFoundError('Brand not found', errorCodes.BRAND_NOT_FOUND);
  }
  return brand;
};

const listBrands = async ({ page, limit, search, country, isVerified, includeInactive, includeDeleted, sort } = {}) => {
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { resolveSort } = marketplace.helpers.sorting;

  const { skip, take, page: safePage, limit: safeLimit } = resolvePagination({ page, limit });
  const orderBy = resolveSort(sort, BRAND.ALLOWED_SORT_FIELDS, 'displayOrder');

  const where = {
    ...(includeDeleted ? {} : { deletedAt: null }),
    ...(includeInactive ? {} : { status: 'ACTIVE' }),
    ...(country ? { country } : {}),
    ...(isVerified !== undefined ? { isVerified: isVerified === 'true' } : {}),
    ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
  };

  const [items, totalCount] = await Promise.all([
    prisma.brand.findMany({ where, orderBy, skip, take }),
    prisma.brand.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta({ page: safePage, limit: safeLimit, totalCount }) };
};

const getFeatured = async () =>
  prisma.brand.findMany({
    where: { isFeatured: true, status: 'ACTIVE', deletedAt: null },
    orderBy: { displayOrder: 'asc' },
  });

const getHomepage = async () =>
  prisma.brand.findMany({
    where: { showOnHomepage: true, status: 'ACTIVE', deletedAt: null },
    orderBy: { displayOrder: 'asc' },
  });

const getVerified = async () =>
  prisma.brand.findMany({
    where: { isVerified: true, status: 'ACTIVE', deletedAt: null },
    orderBy: { displayOrder: 'asc' },
  });

module.exports = {
  createBrand,
  updateBrand,
  softDeleteBrand,
  restoreBrand,
  getBrandById,
  getBrandBySlug,
  listBrands,
  getFeatured,
  getHomepage,
  getVerified,
};