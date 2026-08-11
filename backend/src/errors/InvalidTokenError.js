const AppError = require('./AppError');
const httpStatus = require('../constants/httpStatus');
const errorCodes = require('../constants/errorCodes');

class InvalidTokenError extends AppError {
  constructor(message = 'Invalid authentication token') {
    super(message, httpStatus.UNAUTHORIZED, errorCodes.INVALID_TOKEN);
  }
}

module.exports = InvalidTokenError;