const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const prisma = require('../../database/prismaClient');
const NotFoundError = require('../../errors/NotFoundError');
const errorCodes = require('../../constants/errorCodes');

// Doubles as both "get current session" and "validate session" —
// protected by the `authenticate` middleware, so simply reaching this
// controller already proves the access token is valid. Returns the
// freshest user record from the database (not just the JWT payload).
const getSession = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (!user) {
    throw new NotFoundError('Account not found', errorCodes.USER_NOT_FOUND);
  }

  const { password: _password, ...safeUser } = user;

  return sendSuccess(res, {
    statusCode: httpStatus.OK,
    message: 'Session is valid',
    data: { user: safeUser },
  });
});

module.exports = { getSession };