const logger = require('../logger');

// Placeholder — will record who-did-what-when for sensitive actions
// (e.g. admin actions, order status changes) in future phases.
module.exports = {
  info: (...args) => logger.info('[AUDIT]', ...args),
};