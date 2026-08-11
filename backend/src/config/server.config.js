const env = require('./env');

const serverConfig = {
  port: env.port,
  nodeEnv: env.nodeEnv,
  isProduction: env.nodeEnv === 'production',
  isDevelopment: env.nodeEnv === 'development',
  frontendUrl: env.frontendUrl,
  requestTimeoutMs: env.apiRequestTimeoutMs,
};

module.exports = serverConfig;