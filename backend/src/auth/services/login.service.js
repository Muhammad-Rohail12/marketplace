const prisma = require('../../database/prismaClient');
const passwordUtil = require('../utils/password.util');
const { createSession } = require('./session.service');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');
const ACCOUNT_STATUS = require('../../constants/accountStatus');

const INVALID_CREDENTIALS_MESSAGE = 'Incorrect email or password';

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError(INVALID_CREDENTIALS_MESSAGE, httpStatus.UNAUTHORIZED, errorCodes.INVALID_CREDENTIALS);
  }

  const isPasswordValid = await passwordUtil.comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(INVALID_CREDENTIALS_MESSAGE, httpStatus.UNAUTHORIZED, errorCodes.INVALID_CREDENTIALS);
  }

  if (user.status !== ACCOUNT_STATUS.ACTIVE) {
    throw new AppError(
      'This account has been disabled. Please contact support.',
      httpStatus.FORBIDDEN,
      errorCodes.ACCOUNT_DISABLED
    );
  }

  if (!user.emailVerified) {
    throw new AppError(
      'Please verify your email before logging in',
      httpStatus.FORBIDDEN,
      errorCodes.EMAIL_NOT_VERIFIED
    );
  }

  const { accessToken, refreshToken } = await createSession(user);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const { password: _password, ...safeUser } = updatedUser;

  return { user: safeUser, accessToken, refreshToken };
};

module.exports = { loginUser };