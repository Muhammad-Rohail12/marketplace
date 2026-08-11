const prisma = require('../../database/prismaClient');
const NotFoundError = require('../../errors/NotFoundError');
const AuthorizationError = require('../../errors/AuthorizationError');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');
const { LIMITS } = require('../constants/address.constants');

// ---- Ownership (IDOR defense — every read/write re-derives from
// req.user.id, never trusts an address's implicit owner without
// checking) ----

const getOwnedAddress = async (userId, addressId) => {
  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.deletedAt) throw new NotFoundError('Address not found', errorCodes.ADDRESS_NOT_FOUND);
  if (address.userId !== userId) throw new AuthorizationError('You do not have access to this address');
  return address;
};

const listMyAddresses = async (userId) => {
  return prisma.address.findMany({ where: { userId, deletedAt: null }, orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }] });
};

const getMyAddress = async (userId, addressId) => getOwnedAddress(userId, addressId);

// ---- Create (first address auto-becomes default; documented
// behavior per spec's "document the chosen behavior" instruction) ----

const createAddress = async (userId, data) => {
  const count = await prisma.address.count({ where: { userId, deletedAt: null } });
  if (count >= LIMITS.MAX_ADDRESSES_PER_USER) {
    throw new AppError(
      `You can save up to ${LIMITS.MAX_ADDRESSES_PER_USER} addresses`,
      httpStatus.BAD_REQUEST,
      errorCodes.MAX_ADDRESSES_EXCEEDED
    );
  }

  const shouldBeDefault = data.isDefault === true || count === 0; // first address is always default

  return prisma.$transaction(async (tx) => {
    if (shouldBeDefault) {
      await tx.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
    }
    return tx.address.create({ data: { ...data, userId, isDefault: shouldBeDefault } });
  });
};

// ---- Update ----

const updateAddress = async (userId, addressId, data) => {
  await getOwnedAddress(userId, addressId);

  return prisma.$transaction(async (tx) => {
    if (data.isDefault === true) {
      await tx.address.updateMany({ where: { userId, isDefault: true, id: { not: addressId } }, data: { isDefault: false } });
    }
    return tx.address.update({ where: { id: addressId }, data });
  });
};

// ---- Set default (dedicated transactional endpoint — unsets any
// other default for this user atomically, preventing the two-tabs
// race condition described in the spec) ----

const setDefaultAddress = async (userId, addressId) => {
  await getOwnedAddress(userId, addressId);

  return prisma.$transaction(async (tx) => {
    await tx.address.updateMany({ where: { userId, isDefault: true, id: { not: addressId } }, data: { isDefault: false } });
    return tx.address.update({ where: { id: addressId }, data: { isDefault: true } });
  });
};

// ---- Delete (soft delete; if it was default, auto-promote the next
// most-recent remaining address to default — documented choice
// rather than leaving the user with no default) ----

const deleteAddress = async (userId, addressId) => {
  const address = await getOwnedAddress(userId, addressId);

  await prisma.$transaction(async (tx) => {
    await tx.address.update({ where: { id: addressId }, data: { deletedAt: new Date(), isDefault: false } });

    // Any cart referencing this address as its selected delivery
    // address must be cleared — never leave a dangling reference.
    await tx.cart.updateMany({ where: { selectedAddressId: addressId }, data: { selectedAddressId: null } });

    if (address.isDefault) {
      const next = await tx.address.findFirst({
        where: { userId, deletedAt: null, id: { not: addressId } },
        orderBy: { createdAt: 'desc' },
      });
      if (next) {
        await tx.address.update({ where: { id: next.id }, data: { isDefault: true } });
      }
    }
  });
};

module.exports = { getOwnedAddress, listMyAddresses, getMyAddress, createAddress, updateAddress, setDefaultAddress, deleteAddress };