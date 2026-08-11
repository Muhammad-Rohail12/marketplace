const AppError = require('./AppError');
const httpStatus = require('../constants/httpStatus');
const errorCodes = require('../constants/errorCodes');

// Placeholder — will be thrown by auth middleware once JWT
// verification is implemented in the Authentication milestone.
class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, httpStatus.UNAUTHORIZED, errorCodes.UNAUTHORIZED);
  }
}

module.exports = AuthenticationError;