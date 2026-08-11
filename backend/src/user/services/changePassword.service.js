const prisma = require('../../database/prismaClient');
const passwordUtil = require('../../auth/utils/password.util');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const isCurrentValid = await passwordUtil.comparePassword(currentPassword, user.password);
  if (!isCurrentValid) {
    throw new AppError('Current password is incorrect', httpStatus.BAD_REQUEST, errorCodes.INCORRECT_PASSWORD);
  }

  const hashedPassword = await passwordUtil.hashPassword(newPassword);
  const now = new Date();

  // Same session-invalidation pattern as Phase 13's reset-password:
  // changing the password kills every other active session, forcing
  // re-authentication everywhere except the request that just proved
  // knowledge of the current password.
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, lastPasswordChangeAt: now },
    }),
    prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: now },
    }),
  ]);
};

module.exports = { changePassword };