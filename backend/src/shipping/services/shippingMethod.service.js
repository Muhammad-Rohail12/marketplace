const prisma = require('../../database/prismaClient');
const NotFoundError = require('../../errors/NotFoundError');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');

const listActive = () => prisma.shippingMethod.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } });
const listAll = () => prisma.shippingMethod.findMany({ orderBy: { sortOrder: 'asc' } });

const create = async (data) => {
  const existing = await prisma.shippingMethod.findUnique({ where: { code: data.code } });
  if (existing) throw new AppError('A shipping method with this code already exists', httpStatus.CONFLICT, errorCodes.DUPLICATE_SHIPPING_METHOD_CODE);
  return prisma.shippingMethod.create({ data });
};

const update = async (id, data) => {
  const existing = await prisma.shippingMethod.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Shipping method not found', errorCodes.SHIPPING_METHOD_NOT_FOUND);
  return prisma.shippingMethod.update({ where: { id }, data });
};

const remove = async (id) => {
  const existing = await prisma.shippingMethod.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Shipping method not found', errorCodes.SHIPPING_METHOD_NOT_FOUND);
  // Soft-disable rather than hard delete — preserves referential
  // integrity for existing CartShippingSelection/ShippingRate rows.
  await prisma.shippingMethod.update({ where: { id }, data: { isActive: false } });
};

// Admin management of platform-default (sellerId: null) fallback rates.
const listDefaultRates = () => prisma.shippingRate.findMany({ where: { sellerId: null }, include: { method: true }, orderBy: [{ zone: 'asc' }] });

const createDefaultRate = async (data) => {
  const existing = await prisma.shippingRate.findFirst({ where: { sellerId: null, shippingMethodId: data.shippingMethodId, zone: data.zone } });
  if (existing) throw new AppError('A default rate already exists for this method and zone', httpStatus.CONFLICT, errorCodes.DUPLICATE_SHIPPING_RATE);
  return prisma.shippingRate.create({ data: { ...data, sellerId: null } });
};

const updateDefaultRate = async (id, data) => {
  const existing = await prisma.shippingRate.findUnique({ where: { id } });
  if (!existing || existing.sellerId !== null) throw new NotFoundError('Default rate not found', errorCodes.SHIPPING_RATE_NOT_FOUND);
  return prisma.shippingRate.update({ where: { id }, data });
};

const deleteDefaultRate = async (id) => {
  const existing = await prisma.shippingRate.findUnique({ where: { id } });
  if (!existing || existing.sellerId !== null) throw new NotFoundError('Default rate not found', errorCodes.SHIPPING_RATE_NOT_FOUND);
  await prisma.shippingRate.delete({ where: { id } });
};

module.exports = { listActive, listAll, create, update, remove, listDefaultRates, createDefaultRate, updateDefaultRate, deleteDefaultRate };