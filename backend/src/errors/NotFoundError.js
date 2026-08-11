const AppError = require('./AppError');
const httpStatus = require('../constants/httpStatus');
const errorCodes = require('../constants/errorCodes');

class NotFoundError extends AppError {
  constructor(message = 'Resource not found', errorCode = errorCodes.NOT_FOUND) {
    super(message, httpStatus.NOT_FOUND, errorCode);
  }
}

module.exports = NotFoundError;