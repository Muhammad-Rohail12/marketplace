const prisma = require('../../database/prismaClient');
const NotFoundError = require('../../errors/NotFoundError');
const AuthorizationError = require('../../errors/AuthorizationError');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');

const getSellerByUserId = async (userId) => {
  const seller = await prisma.seller.findUnique({ where: { userId } });
  if (!seller || seller.deletedAt) throw new NotFoundError('Seller profile not found', errorCodes.SELLER_NOT_FOUND);
  return seller;
};

const getMySettings = async (userId) => {
  const seller = await getSellerByUserId(userId);
  const settings = await prisma.sellerShippingSettings.findUnique({ where: { sellerId: seller.id } });
  return settings || { sellerId: seller.id, processingMinDays: 1, processingMaxDays: 2, freeShippingThreshold: null };
};

const upsertMySettings = async (userId, data) => {
  const seller = await getSellerByUserId(userId);
  return prisma.sellerShippingSettings.upsert({
    where: { sellerId: seller.id },
    update: data,
    create: { sellerId: seller.id, processingMinDays: 1, processingMaxDays: 2, ...data },
  });
};

const listMyRates = async (userId) => {
  const seller = await getSellerByUserId(userId);
  return prisma.shippingRate.findMany({ where: { sellerId: seller.id }, include: { method: true }, orderBy: [{ zone: 'asc' }] });
};

const getOwnedRate = async (userId, rateId) => {
  const seller = await getSellerByUserId(userId);
  const rate = await prisma.shippingRate.findUnique({ where: { id: rateId } });
  if (!rate) throw new NotFoundError('Shipping rate not found', errorCodes.SHIPPING_RATE_NOT_FOUND);
  if (rate.sellerId !== seller.id) throw new AuthorizationError('You do not have access to this shipping rate');
  return rate;
};

const createMyRate = async (userId, data) => {
  const seller = await getSellerByUserId(userId);

  const method = await prisma.shippingMethod.findUnique({ where: { id: data.shippingMethodId } });
  if (!method || !method.isActive) {
    throw new AppError('Shipping method not found or inactive', httpStatus.BAD_REQUEST, errorCodes.SHIPPING_METHOD_NOT_FOUND);
  }

  const existing = await prisma.shippingRate.findFirst({ where: { sellerId: seller.id, shippingMethodId: data.shippingMethodId, zone: data.zone } });
  if (existing) throw new AppError('A rate already exists for this method and zone', httpStatus.CONFLICT, errorCodes.DUPLICATE_SHIPPING_RATE);

  return prisma.shippingRate.create({ data: { ...data, sellerId: seller.id } });
};

const updateMyRate = async (userId, rateId, data) => {
  await getOwnedRate(userId, rateId);
  return prisma.shippingRate.update({ where: { id: rateId }, data });
};

const deleteMyRate = async (userId, rateId) => {
  await getOwnedRate(userId, rateId);
  await prisma.shippingRate.delete({ where: { id: rateId } });
};

module.exports = { getMySettings, upsertMySettings, listMyRates, createMyRate, updateMyRate, deleteMyRate };