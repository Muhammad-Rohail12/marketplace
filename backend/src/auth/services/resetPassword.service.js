const prisma = require('../../database/prismaClient');
const passwordUtil = require('../utils/password.util');
const { hashToken } = require('../utils/verificationToken.util');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');

const VERIFICATION_TOKEN_TYPE = { PASSWORD_RESET: 'PASSWORD_RESET' };

const RESET_ERROR_MESSAGE = 'This reset link is invalid or has expired';

const resetPassword = async ({ token: rawToken, password }) => {
  const tokenHash = hashToken(rawToken);

  const record = await prisma.verificationToken.findUnique({ where: { tokenHash } });

  if (!record || record.type !== VERIFICATION_TOKEN_TYPE.PASSWORD_RESET) {
    throw new AppError(RESET_ERROR_MESSAGE, httpStatus.BAD_REQUEST, errorCodes.INVALID_TOKEN);
  }

  if (record.usedAt) {
    throw new AppError(
      'This reset link has already been used',
      httpStatus.BAD_REQUEST,
      errorCodes.TOKEN_ALREADY_USED
    );
  }

  if (record.expiresAt < new Date()) {
    throw new AppError(RESET_ERROR_MESSAGE, httpStatus.BAD_REQUEST, errorCodes.TOKEN_EXPIRED);
  }

  const user = await prisma.user.findUnique({ where: { id: record.userId } });

  if (!user) {
    throw new AppError(RESET_ERROR_MESSAGE, httpStatus.BAD_REQUEST, errorCodes.INVALID_TOKEN);
  }

  const hashedPassword = await passwordUtil.hashPassword(password);
  const now = new Date();

  // Single transaction: update password, mark token used, revoke every
  // active refresh token (session) for this user — forces re-login
  // everywhere, including any device where the old password's session
  // was still active. Mirrors the Phase 11 replay-detection revocation pattern.
  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } }),
    prisma.verificationToken.update({ where: { id: record.id }, data: { usedAt: now } }),
    prisma.refreshToken.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: now },
    }),
  ]);
};

module.exports = { resetPassword };