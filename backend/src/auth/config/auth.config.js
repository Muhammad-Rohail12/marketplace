const config = require('../../config');

const authConfig = {
  jwt: {
    secret: config.security.jwt.secret,
    expiresIn: config.security.jwt.expiresIn,
    refreshSecret: config.security.jwt.refreshSecret,
    refreshExpiresIn: config.security.jwt.refreshExpiresIn,
  },
  bcrypt: {
    saltRounds: config.security.bcrypt.saltRounds,
  },
  cookie: {
    secure: config.server.isProduction,
    sameSite: 'strict',
  },
};

module.exports = authConfig;