const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');

const generateAccessToken = (payload) =>
  jwt.sign(payload, authConfig.jwt.secret, { expiresIn: authConfig.jwt.expiresIn });

const generateRefreshToken = (payload) =>
  jwt.sign(payload, authConfig.jwt.refreshSecret, { expiresIn: authConfig.jwt.refreshExpiresIn });

const verifyAccessToken = (token) => jwt.verify(token, authConfig.jwt.secret);

const verifyRefreshToken = (token) => jwt.verify(token, authConfig.jwt.refreshSecret);

// Decodes without verifying signature — for inspection only,
// never trust decodeToken() output for authorization decisions.
const decodeToken = (token) => jwt.decode(token);

const isTokenExpired = (decoded) => {
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  isTokenExpired,
};
