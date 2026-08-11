const AppError = require('./AppError');
const httpStatus = require('../constants/httpStatus');
const errorCodes = require('../constants/errorCodes');

class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, httpStatus.INTERNAL_SERVER_ERROR, errorCodes.INTERNAL_ERROR);
    this.isOperational = false;
  }
}

module.exports = InternalServerError;