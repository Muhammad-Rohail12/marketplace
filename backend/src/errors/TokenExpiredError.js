const AppError = require('./AppError');
const httpStatus = require('../constants/httpStatus');
const errorCodes = require('../constants/errorCodes');

class TokenExpiredError extends AppError {
  constructor(message = 'Authentication token has expired') {
    super(message, httpStatus.UNAUTHORIZED, errorCodes.TOKEN_EXPIRED);
  }
}

module.exports = TokenExpiredError;