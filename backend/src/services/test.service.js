const messages = require('../constants/messages');

const getTestConnection = () => {
  return { message: messages.TEST_OK };
};

module.exports = { getTestConnection };