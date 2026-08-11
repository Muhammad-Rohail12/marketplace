const env = require('./env');

// Reserved for the Authentication milestone.
// Nothing here is wired into any route, middleware, or controller yet.
const securityConfig = {
  jwt: {
    secret: env.jwtSecret,
    expiresIn: env.jwtExpiresIn,
    refreshSecret: env.jwtRefreshSecret,
    refreshExpiresIn: env.jwtRefreshExpiresIn,
  },
  bcrypt: {
    saltRounds: env.bcryptSaltRounds,
  },
  cors: {
    origin: env.frontendUrl,
    credentials: true,
  },
};

module.exports = securityConfig;