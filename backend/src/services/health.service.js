const messages = require('../constants/messages');

const getHealthStatus = () => {
  return { message: messages.HEALTH_OK };
};

module.exports = { getHealthStatus };