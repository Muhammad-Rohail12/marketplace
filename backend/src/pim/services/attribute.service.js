const prisma = require('../../database/prismaClient');
const marketplace = require('../../marketplace');
const NotFoundError = require('../../errors/NotFoundError');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');
const PIM = require('../constants/pim.constants');

// ---- Attribute Groups ----

const uniqueSlugFor = async (name, excludeId = null) => {
  const base = marketplace.helpers.slug.generateSlug(name);
  let slug = base;
  let suffix = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.attributeGroup.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    if (!existing) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
};

const createAttributeGroup = async (data) => {
  const slug = await uniqueSlugFor(data.name);
  return prisma.attributeGroup.create({ data: { ...data, slug } });
};

const updateAttributeGroup = async (id, data) => {
  const existing = await prisma.attributeGroup.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Attribute group not found', errorCodes.ATTRIBUTE_GROUP_NOT_FOUND);
  if (data.name && data.name !== existing.name) data.slug = await uniqueSlugFor(data.name, id);
  return prisma.attributeGroup.update({ where: { id }, data });
};

const deleteAttributeGroup = async (id) => {
  const existing = await prisma.attributeGroup.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Attribute group not found', errorCodes.ATTRIBUTE_GROUP_NOT_FOUND);
  await prisma.attributeGroup.delete({ where: { id } });
};

const listAttributeGroups = async ({ page, limit, search, sort } = {}) => {
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { resolveSort } = marketplace.helpers.sorting;
  const { skip, take, page: safePage, limit: safeLimit } = resolvePagination({ page, limit });
  const orderBy = resolveSort(sort, PIM.ALLOWED_SORT_FIELDS, 'displayOrder');
  const where = search ? { name: { contains: search, mode: 'insensitive' } } : {};

  const [items, totalCount] = await Promise.all([
    prisma.attributeGroup.findMany({ where, orderBy, skip, take, include: { attributes: true } }),
    prisma.attributeGroup.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta({ page: safePage, limit: safeLimit, totalCount }) };
};

// ---- Attributes ----

const createAttribute = async (data) => {
  const existingCode = await prisma.attribute.findUnique({ where: { code: data.code } });
  if (existingCode) throw new AppError('An attribute with this code already exists', httpStatus.CONFLICT, errorCodes.DUPLICATE_NAME);
  return prisma.attribute.create({ data });
};

const updateAttribute = async (id, data) => {
  const existing = await prisma.attribute.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Attribute not found', errorCodes.ATTRIBUTE_NOT_FOUND);
  return prisma.attribute.update({ where: { id }, data });
};

const deleteAttribute = async (id) => {
  const existing = await prisma.attribute.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Attribute not found', errorCodes.ATTRIBUTE_NOT_FOUND);
  await prisma.attribute.delete({ where: { id } });
};

const getAttributeById = async (id) => {
  const attribute = await prisma.attribute.findUnique({ where: { id }, include: { values: true, group: true } });
  if (!attribute) throw new NotFoundError('Attribute not found', errorCodes.ATTRIBUTE_NOT_FOUND);
  return attribute;
};

const listAttributes = async ({ page, limit, search, groupId, type, sort } = {}) => {
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { resolveSort } = marketplace.helpers.sorting;
  const { skip, take, page: safePage, limit: safeLimit } = resolvePagination({ page, limit });
  const orderBy = resolveSort(sort, PIM.ALLOWED_SORT_FIELDS, 'displayOrder');

  const where = {
    ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
    ...(groupId ? { groupId: Number(groupId) } : {}),
    ...(type ? { type } : {}),
  };

  const [items, totalCount] = await Promise.all([
    prisma.attribute.findMany({ where, orderBy, skip, take, include: { values: true, group: true } }),
    prisma.attribute.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta({ page: safePage, limit: safeLimit, totalCount }) };
};

// ---- Attribute Values ----

const createAttributeValue = async (attributeId, data) => {
  const attribute = await prisma.attribute.findUnique({ where: { id: attributeId } });
  if (!attribute) throw new NotFoundError('Attribute not found', errorCodes.ATTRIBUTE_NOT_FOUND);

  const existing = await prisma.attributeValue.findUnique({
    where: { attributeId_value: { attributeId, value: data.value } },
  });
  if (existing) throw new AppError('This value already exists for the attribute', httpStatus.CONFLICT, errorCodes.DUPLICATE_NAME);

  return prisma.attributeValue.create({ data: { ...data, attributeId } });
};

const updateAttributeValue = async (id, data) => {
  const existing = await prisma.attributeValue.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Attribute value not found', errorCodes.ATTRIBUTE_VALUE_NOT_FOUND);
  return prisma.attributeValue.update({ where: { id }, data });
};

const deleteAttributeValue = async (id) => {
  const existing = await prisma.attributeValue.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Attribute value not found', errorCodes.ATTRIBUTE_VALUE_NOT_FOUND);
  await prisma.attributeValue.delete({ where: { id } });
};

const listAttributeValues = async (attributeId) => {
  return prisma.attributeValue.findMany({ where: { attributeId }, orderBy: { displayOrder: 'asc' } });
};

// ---- Category Attribute Assignments ----

const assignCategoryAttribute = async (data) => {
  const existing = await prisma.categoryAttribute.findUnique({
    where: { categoryId_attributeId: { categoryId: data.categoryId, attributeId: data.attributeId } },
  });
  if (existing) {
    throw new AppError('This attribute is already assigned to the category', httpStatus.CONFLICT, errorCodes.DUPLICATE_CATEGORY_ATTRIBUTE);
  }
  return prisma.categoryAttribute.create({ data, include: { attribute: true } });
};

const removeCategoryAttribute = async (id) => {
  const existing = await prisma.categoryAttribute.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Category attribute assignment not found', errorCodes.CATEGORY_ATTRIBUTE_NOT_FOUND);
  await prisma.categoryAttribute.delete({ where: { id } });
};

const listCategoryAttributes = async (categoryId) => {
  return prisma.categoryAttribute.findMany({
    where: { categoryId: Number(categoryId) },
    include: { attribute: { include: { values: true } } },
    orderBy: { displayOrder: 'asc' },
  });
};

module.exports = {
  createAttributeGroup,
  updateAttributeGroup,
  deleteAttributeGroup,
  listAttributeGroups,
  createAttribute,
  updateAttribute,
  deleteAttribute,
  getAttributeById,
  listAttributes,
  createAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
  listAttributeValues,
  assignCategoryAttribute,
  removeCategoryAttribute,
  listCategoryAttributes,
};