const logger = require('../logger');

// Placeholder — will log auth failures, suspicious activity, etc.
// once the Authentication milestone begins. Not called anywhere yet.
module.exports = {
  info: (...args) => logger.info('[SECURITY]', ...args),
  warn: (...args) => logger.warn('[SECURITY]', ...args),
  error: (...args) => logger.error('[SECURITY]', ...args),
};