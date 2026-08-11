const prisma = require('../../database/prismaClient');
const NotFoundError = require('../../errors/NotFoundError');
const errorCodes = require('../../constants/errorCodes');

const createTemplate = async (data) => prisma.productSpecificationTemplate.create({ data });

const updateTemplate = async (id, data) => {
  const existing = await prisma.productSpecificationTemplate.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Specification template not found', errorCodes.SPEC_TEMPLATE_NOT_FOUND);
  return prisma.productSpecificationTemplate.update({ where: { id }, data });
};

const deleteTemplate = async (id) => {
  const existing = await prisma.productSpecificationTemplate.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Specification template not found', errorCodes.SPEC_TEMPLATE_NOT_FOUND);
  await prisma.productSpecificationTemplate.delete({ where: { id } });
};

const listTemplates = async ({ categoryId } = {}) => {
  return prisma.productSpecificationTemplate.findMany({
    where: categoryId ? { categoryId: Number(categoryId) } : {},
    include: { items: { orderBy: { displayOrder: 'asc' }, include: { attribute: true } }, category: true },
    orderBy: { createdAt: 'desc' },
  });
};

const getTemplateById = async (id) => {
  const template = await prisma.productSpecificationTemplate.findUnique({
    where: { id },
    include: { items: { orderBy: { displayOrder: 'asc' }, include: { attribute: true } }, category: true },
  });
  if (!template) throw new NotFoundError('Specification template not found', errorCodes.SPEC_TEMPLATE_NOT_FOUND);
  return template;
};

const addTemplateItem = async (templateId, data) => {
  const template = await prisma.productSpecificationTemplate.findUnique({ where: { id: templateId } });
  if (!template) throw new NotFoundError('Specification template not found', errorCodes.SPEC_TEMPLATE_NOT_FOUND);
  return prisma.specificationTemplateItem.create({ data: { ...data, templateId } });
};

const removeTemplateItem = async (itemId) => {
  await prisma.specificationTemplateItem.delete({ where: { id: itemId } });
};

module.exports = { createTemplate, updateTemplate, deleteTemplate, listTemplates, getTemplateById, addTemplateItem, removeTemplateItem };