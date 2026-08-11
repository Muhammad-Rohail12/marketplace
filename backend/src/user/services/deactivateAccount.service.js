const prisma = require('../../database/prismaClient');
const passwordUtil = require('../../auth/utils/password.util');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');
const ACCOUNT_STATUS = require('../../constants/accountStatus');

const deactivateAccount = async (userId, { password }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const isPasswordValid = await passwordUtil.comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Password is incorrect', httpStatus.BAD_REQUEST, errorCodes.INCORRECT_PASSWORD);
  }

  const now = new Date();

  // Data is preserved (no deletion) — status flip + timestamp only.
  // login.service.js already rejects any non-ACTIVE status, so this
  // immediately blocks login without any additional checks needed.
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { status: ACCOUNT_STATUS.INACTIVE, deactivatedAt: now },
    }),
    prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: now },
    }),
  ]);
};

module.exports = { deactivateAccount };