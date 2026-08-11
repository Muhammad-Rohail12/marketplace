const prisma = require('../../database/prismaClient');
const { generateRawToken, hashToken } = require('../utils/verificationToken.util');
const config = require('../../config');
const { sendMail } = require('./email.service');
const verificationEmailTemplate = require('../templates/verificationEmail.template');
const AppError = require('../../errors/AppError');
const NotFoundError = require('../../errors/NotFoundError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');

const createAndSendVerificationToken = async (user) => {
  const rawToken = generateRawToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + config.email.verificationExpiresInHours * 60 * 60 * 1000);

  // Invalidate any previous unused tokens so only the newest link works.
  await prisma.verificationToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  await prisma.verificationToken.create({
    data: { tokenHash, userId: user.id, expiresAt },
  });

  const verifyUrl = `${config.server.frontendUrl}/verify-email?token=${rawToken}`;
  const { subject, html, text } = verificationEmailTemplate({
    firstName: user.firstName,
    verifyUrl,
    expiresInHours: config.email.verificationExpiresInHours,
  });

  await sendMail({ to: user.email, subject, html, text });
};

const verifyEmailToken = async (rawToken) => {
  if (!rawToken) {
    throw new AppError('Verification token is required', httpStatus.BAD_REQUEST, errorCodes.TOKEN_MISSING);
  }

  const tokenHash = hashToken(rawToken);
  const record = await prisma.verificationToken.findUnique({ where: { tokenHash } });

  if (!record) {
    throw new AppError('Invalid or expired verification link', httpStatus.BAD_REQUEST, errorCodes.INVALID_TOKEN);
  }

  if (record.usedAt) {
    throw new AppError(
      'This verification link has already been used',
      httpStatus.BAD_REQUEST,
      errorCodes.TOKEN_ALREADY_USED
    );
  }

  if (record.expiresAt < new Date()) {
    throw new AppError('This verification link has expired', httpStatus.BAD_REQUEST, errorCodes.TOKEN_EXPIRED);
  }

  const user = await prisma.user.findUnique({ where: { id: record.userId } });

  if (!user) {
    throw new NotFoundError('Account not found', errorCodes.USER_NOT_FOUND);
  }

  if (user.emailVerified) {
    await prisma.verificationToken.update({ where: { id: record.id }, data: { usedAt: new Date() } });
    return { alreadyVerified: true, user };
  }

  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, emailVerifiedAt: new Date() },
    }),
    prisma.verificationToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);

  return { alreadyVerified: false, user: updatedUser };
};

const resendVerificationEmail = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // Always behave identically regardless of whether the account
  // exists or is already verified — prevents user enumeration.
  if (user && !user.emailVerified) {
    await createAndSendVerificationToken(user);
  }
};

module.exports = { createAndSendVerificationToken, verifyEmailToken, resendVerificationEmail };