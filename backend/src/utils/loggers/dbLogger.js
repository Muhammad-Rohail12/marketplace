const logger = require('../logger');

// Placeholder — will wrap Prisma query-event logging in a future phase.
module.exports = {
  info: (...args) => logger.info('[DB]', ...args),
  warn: (...args) => logger.warn('[DB]', ...args),
  error: (...args) => logger.error('[DB]', ...args),
};
