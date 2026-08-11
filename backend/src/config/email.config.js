const env = require('./env');

const emailConfig = {
  host: env.emailHost,
  port: env.emailPort,
  secure: env.emailSecure,
  user: env.emailUser,
  pass: env.emailPass,
  from: env.emailFrom,
  verificationExpiresInHours: env.emailVerificationExpiresInHours,
  passwordResetExpiresInMinutes: env.passwordResetExpiresInMinutes,
};

module.exports = emailConfig;