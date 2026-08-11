const AppError = require('./AppError');
const httpStatus = require('../constants/httpStatus');
const errorCodes = require('../constants/errorCodes');

class ConflictError extends AppError {
  constructor(message = 'Resource already exists', errorCode = errorCodes.EMAIL_ALREADY_EXISTS) {
    super(message, httpStatus.CONFLICT, errorCode);
  }
}

module.exports = ConflictError;