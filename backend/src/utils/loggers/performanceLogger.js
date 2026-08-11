const logger = require('../logger');

// Placeholder — will log slow queries/requests once thresholds
// are defined in a future performance-optimization phase.
module.exports = {
  warn: (...args) => logger.warn('[PERFORMANCE]', ...args),
};