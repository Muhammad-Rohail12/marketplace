const { sendError } = require('../utils/responseHandler');
const httpStatus = require('../constants/httpStatus');
const errorCodes = require('../constants/errorCodes');
const config = require('../config');
const logger = require('../utils/logger');

const handleError = (err, req, res, next) => {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const errorCode = err.errorCode || errorCodes.INTERNAL_ERROR;
  const baseErrors = err.errors && err.errors.length ? err.errors : [];

  const isUnexpected = !err.isOperational;
  const message =
    isUnexpected && config.server.isProduction
      ? 'Internal server error'
      : err.message || 'Internal server error';

  if (isUnexpected) {
    logger.error(`UNEXPECTED ERROR [${req.requestId}]:`, err.stack || err);
  } else {
    logger.warn(`[${req.requestId}] ${message}`);
  }

  // Stack traces only ever included in development, and only for
  // unexpected errors — never sent to clients in production.
  const errors =
    isUnexpected && config.server.isDevelopment
      ? [...baseErrors, { stack: err.stack }]
      : baseErrors;

  return sendError(res, { statusCode, message, errors, errorCode });
};

module.exports = handleError;