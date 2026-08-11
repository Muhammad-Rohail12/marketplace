require('dotenv').config();

const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,

  apiRequestTimeoutMs: Number(process.env.API_REQUEST_TIMEOUT_MS) || 30000,

  emailHost: process.env.EMAIL_HOST || '',
  emailPort: Number(process.env.EMAIL_PORT) || 587,
  emailSecure: process.env.EMAIL_SECURE === 'true',
  emailUser: process.env.EMAIL_USER || '',
  emailPass: process.env.EMAIL_PASS || '',
  emailFrom: process.env.EMAIL_FROM || 'no-reply@marketplace.example.com',
  emailVerificationExpiresInHours: Number(process.env.EMAIL_VERIFICATION_EXPIRES_HOURS) || 24,

  passwordResetExpiresInMinutes: Number(process.env.PASSWORD_RESET_EXPIRES_MINUTES) || 30,
};

module.exports = env;