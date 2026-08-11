const prisma = require('../../database/prismaClient');
const NotFoundError = require('../../errors/NotFoundError');
const errorCodes = require('../../constants/errorCodes');
const { getOwnedAddress } = require('./address.service');
const { STATUS } = require('../../cart/constants/cart.constants');

// Selects a delivery address for the user's active cart. Address
// ownership is re-verified here via getOwnedAddress — the frontend's
// addressId is never trusted as-is, exactly per spec's explicit
// "Customer A cannot attach Customer B's address to their cart" rule.
const selectCartAddress = async (userId, addressId) => {
  await getOwnedAddress(userId, addressId); // throws if not owned

  const cart = await prisma.cart.findFirst({ where: { userId, status: STATUS.ACTIVE } });
  if (!cart) throw new NotFoundError('Cart not found', errorCodes.CART_NOT_FOUND);

  return prisma.cart.update({ where: { id: cart.id }, data: { selectedAddressId: addressId } });
};

const getCartAddress = async (userId) => {
  const cart = await prisma.cart.findFirst({
    where: { userId, status: STATUS.ACTIVE },
    include: { selectedAddress: true },
  });
  return cart?.selectedAddress || null;
};

const clearCartAddress = async (userId) => {
  const cart = await prisma.cart.findFirst({ where: { userId, status: STATUS.ACTIVE } });
  if (!cart) return;
  await prisma.cart.update({ where: { id: cart.id }, data: { selectedAddressId: null } });
};

module.exports = { selectCartAddress, getCartAddress, clearCartAddress };