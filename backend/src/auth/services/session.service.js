const crypto = require('crypto');
const prisma = require('../../database/prismaClient');
const jwtUtil = require('../utils/jwt.util');
const AppError = require('../../errors/AppError');
const httpStatus = require('../../constants/httpStatus');
const errorCodes = require('../../constants/errorCodes');
const ACCOUNT_STATUS = require('../../constants/accountStatus');

const hashToken = (rawToken) => crypto.createHash('sha256').update(rawToken).digest('hex');

const SESSION_INVALID_MESSAGE = 'Session is no longer valid. Please log in again.';

// Issues a fresh access + refresh token pair and persists the
// refresh token's hash for future rotation/revocation lookups.
const createSession = async (user) => {
  const accessToken = jwtUtil.generateAccessToken({ id: user.id, role: user.role, email: user.email });
  const refreshToken = jwtUtil.generateRefreshToken({ id: user.id });

  const decoded = jwtUtil.decodeToken(refreshToken);
  const expiresAt = new Date(decoded.exp * 1000);

  await prisma.refreshToken.create({
    data: { tokenHash: hashToken(refreshToken), userId: user.id, expiresAt },
  });

  return { accessToken, refreshToken, expiresAt };
};

// Verifies a refresh token, rotates it (revoke old, issue new), and
// returns a fresh session. Detects reuse of an already-revoked token
// as a possible replay attack and revokes ALL of that user's active
// sessions as a precaution.
const rotateSession = async (rawRefreshToken) => {
  if (!rawRefreshToken) {
    throw new AppError('Refresh token missing', httpStatus.UNAUTHORIZED, errorCodes.TOKEN_MISSING);
  }

  let payload;
  try {
    payload = jwtUtil.verifyRefreshToken(rawRefreshToken);
  } catch (err) {
    const code = err.name === 'TokenExpiredError' ? errorCodes.TOKEN_EXPIRED : errorCodes.INVALID_TOKEN;
    throw new AppError(SESSION_INVALID_MESSAGE, httpStatus.UNAUTHORIZED, code);
  }

  const tokenHash = hashToken(rawRefreshToken);
  const record = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!record) {
    throw new AppError(SESSION_INVALID_MESSAGE, httpStatus.UNAUTHORIZED, errorCodes.INVALID_TOKEN);
  }

  if (record.revokedAt) {
    // Reuse of a revoked token — treat as a possible replay attack
    // and revoke every active session for this user.
    await prisma.refreshToken.updateMany({
      where: { userId: record.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    throw new AppError(SESSION_INVALID_MESSAGE, httpStatus.UNAUTHORIZED, errorCodes.INVALID_TOKEN);
  }

  if (record.expiresAt < new Date()) {
    throw new AppError(SESSION_INVALID_MESSAGE, httpStatus.UNAUTHORIZED, errorCodes.TOKEN_EXPIRED);
  }

  const user = await prisma.user.findUnique({ where: { id: payload.id } });

  if (!user || user.status !== ACCOUNT_STATUS.ACTIVE) {
    await prisma.refreshToken.update({ where: { id: record.id }, data: { revokedAt: new Date() } });
    throw new AppError(SESSION_INVALID_MESSAGE, httpStatus.UNAUTHORIZED, errorCodes.INVALID_TOKEN);
  }

  // Rotation: revoke the used token, then issue a brand new pair.
  await prisma.refreshToken.update({ where: { id: record.id }, data: { revokedAt: new Date() } });

  const session = await createSession(user);
  const { password: _password, ...safeUser } = user;

  return { ...session, user: safeUser };
};

const revokeSession = async (rawRefreshToken) => {
  if (!rawRefreshToken) return;
  const tokenHash = hashToken(rawRefreshToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};

module.exports = { createSession, rotateSession, revokeSession };