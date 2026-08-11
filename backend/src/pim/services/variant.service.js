const prisma = require('../../database/prismaClient');
const NotFoundError = require('../../errors/NotFoundError');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');

// ---- Variant Options ----

const createVariantOption = async (data) => {
  const existing = await prisma.variantOption.findUnique({
    where: { attributeId_attributeValueId: data },
  });
  if (existing) throw new AppError('This variant option already exists', httpStatus.CONFLICT, errorCodes.DUPLICATE_NAME);

  return prisma.variantOption.create({ data, include: { attribute: true, attributeValue: true } });
};

const deleteVariantOption = async (id) => {
  const existing = await prisma.variantOption.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Variant option not found', errorCodes.VARIANT_OPTION_NOT_FOUND);
  await prisma.variantOption.delete({ where: { id } });
};

const listVariantOptions = async ({ attributeId } = {}) => {
  return prisma.variantOption.findMany({
    where: attributeId ? { attributeId: Number(attributeId) } : {},
    include: { attribute: true, attributeValue: true },
    orderBy: { id: 'asc' },
  });
};

// ---- Variant Combinations ----

const findCombinationBySameOptions = async (optionIds, excludeId = null) => {
  if (!optionIds.length) return null;
  const candidates = await prisma.variantCombination.findMany({
    where: { ...(excludeId ? { id: { not: excludeId } } : {}) },
    include: { options: true },
  });
  const sortedTarget = [...optionIds].sort().join(',');
  return candidates.find((c) => {
    const sortedExisting = c.options.map((o) => o.variantOptionId).sort().join(',');
    return sortedExisting === sortedTarget;
  });
};

const createVariantCombination = async (data, optionIds) => {
  if (!optionIds.length) {
    throw new AppError('At least one variant option is required', httpStatus.BAD_REQUEST, errorCodes.VALIDATION_FAILED);
  }

  const duplicate = await findCombinationBySameOptions(optionIds);
  if (duplicate) {
    throw new AppError('A combination with these exact options already exists', httpStatus.CONFLICT, errorCodes.DUPLICATE_VARIANT_COMBINATION);
  }

  return prisma.variantCombination.create({
    data: {
      ...data,
      options: { create: optionIds.map((variantOptionId) => ({ variantOptionId })) },
    },
    include: { options: { include: { variantOption: { include: { attribute: true, attributeValue: true } } } } },
  });
};

const updateVariantCombination = async (id, data, optionIds) => {
  const existing = await prisma.variantCombination.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Variant combination not found', errorCodes.VARIANT_COMBINATION_NOT_FOUND);

  if (optionIds && optionIds.length) {
    const duplicate = await findCombinationBySameOptions(optionIds, id);
    if (duplicate) {
      throw new AppError('A combination with these exact options already exists', httpStatus.CONFLICT, errorCodes.DUPLICATE_VARIANT_COMBINATION);
    }
    await prisma.variantCombinationOption.deleteMany({ where: { combinationId: id } });
    await prisma.variantCombinationOption.createMany({
      data: optionIds.map((variantOptionId) => ({ combinationId: id, variantOptionId })),
    });
  }

  return prisma.variantCombination.update({
    where: { id },
    data,
    include: { options: { include: { variantOption: { include: { attribute: true, attributeValue: true } } } } },
  });
};

const deleteVariantCombination = async (id) => {
  const existing = await prisma.variantCombination.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Variant combination not found', errorCodes.VARIANT_COMBINATION_NOT_FOUND);
  await prisma.variantCombination.delete({ where: { id } });
};

const listVariantCombinations = async ({ page, limit } = {}) => {
  const marketplace = require('../../marketplace');
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { skip, take, page: safePage, limit: safeLimit } = resolvePagination({ page, limit });

  const [items, totalCount] = await Promise.all([
    prisma.variantCombination.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { options: { include: { variantOption: { include: { attribute: true, attributeValue: true } } } } },
    }),
    prisma.variantCombination.count(),
  ]);

  return { items, meta: buildPaginationMeta({ page: safePage, limit: safeLimit, totalCount }) };
};

module.exports = {
  createVariantOption,
  deleteVariantOption,
  listVariantOptions,
  createVariantCombination,
  updateVariantCombination,
  deleteVariantCombination,
  listVariantCombinations,
};