const prisma = require('../../database/prismaClient');
const { generateRawToken, hashToken } = require('../utils/verificationToken.util');
const config = require('../../config');
const { sendMail } = require('./email.service');
const passwordResetEmailTemplate = require('../templates/passwordResetEmail.template');
const logger = require('../../utils/logger');
const TOKEN_TYPES = require('../../constants/auth').TOKEN_TYPES;

const VERIFICATION_TOKEN_TYPE = { PASSWORD_RESET: 'PASSWORD_RESET' };

const createAndSendPasswordResetToken = async (user) => {
  const rawToken = generateRawToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + config.email.passwordResetExpiresInMinutes * 60 * 1000);

  // Invalidate any previous unused reset tokens for this user so only
  // the newest request's link works (mirrors the Phase 9 email-verification pattern).
  await prisma.verificationToken.updateMany({
    where: { userId: user.id, type: VERIFICATION_TOKEN_TYPE.PASSWORD_RESET, usedAt: null },
    data: { usedAt: new Date() },
  });

  await prisma.verificationToken.create({
    data: {
      tokenHash,
      userId: user.id,
      type: VERIFICATION_TOKEN_TYPE.PASSWORD_RESET,
      expiresAt,
    },
  });

  const resetUrl = `${config.server.frontendUrl}/reset-password?token=${rawToken}`;
  const { subject, html, text } = passwordResetEmailTemplate({
    firstName: user.firstName,
    resetUrl,
    expiresInMinutes: config.email.passwordResetExpiresInMinutes,
  });

  await sendMail({ to: user.email, subject, html, text });
};

// Always resolves the same way regardless of whether the account
// exists — the controller returns one generic message either way,
// preventing user enumeration via this endpoint.
const requestPasswordReset = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return;

  try {
    await createAndSendPasswordResetToken(user);
  } catch (err) {
    // Never let email delivery failure leak through as a different
    // response than the unknown-email case — log server-side only.
    logger.error('Failed to send password reset email:', err);
  }
};

module.exports = { requestPasswordReset, createAndSendPasswordResetToken };
