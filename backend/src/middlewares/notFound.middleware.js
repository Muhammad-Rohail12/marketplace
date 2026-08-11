const { sendError } = require('../utils/responseHandler');
const httpStatus = require('../constants/httpStatus');
const messages = require('../constants/messages');
const errorCodes = require('../constants/errorCodes');

const notFound = (req, res, next) => {
  sendError(res, {
    statusCode: httpStatus.NOT_FOUND,
    message: messages.ROUTE_NOT_FOUND,
    errorCode: errorCodes.ROUTE_NOT_FOUND,
  });
};

module.exports = notFound;