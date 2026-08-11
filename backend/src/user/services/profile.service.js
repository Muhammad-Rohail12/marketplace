const prisma = require('../../database/prismaClient');
const NotFoundError = require('../../errors/NotFoundError');
const errorCodes = require('../../constants/errorCodes');

const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('Account not found', errorCodes.USER_NOT_FOUND);
  return sanitizeUser(user);
};

const updateProfile = async (userId, data) => {
  const user = await prisma.user.update({ where: { id: userId }, data });
  return sanitizeUser(user);
};

module.exports = { getProfile, updateProfile, sanitizeUser };