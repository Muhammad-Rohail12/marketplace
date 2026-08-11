const prisma = require('../../database/prismaClient');
const passwordUtil = require('../utils/password.util');
const ConflictError = require('../../errors/ConflictError');
const ROLES = require('../../constants/roles');
const logger = require('../../utils/logger');
const { createAndSendVerificationToken } = require('./verification.service');

const registerUser = async ({ firstName, lastName, email, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new ConflictError('An account with this email already exists');
  }

  const hashedPassword = await passwordUtil.hashPassword(password);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: ROLES.BUYER,
    },
  });

  try {
    await createAndSendVerificationToken(user);
  } catch (err) {
    // Registration must still succeed even if the email fails to
    // send — the user can request a resend from /verify-email.
    logger.error('Failed to send verification email:', err);
  }

  const { password: _password, ...safeUser } = user;
  return safeUser;
};

module.exports = { registerUser };