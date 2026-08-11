const AppError = require('./AppError');
const httpStatus = require('../constants/httpStatus');
const errorCodes = require('../constants/errorCodes');

// Placeholder — will be thrown by role-based authorization
// middleware in the Role-Based Authorization phase.
class AuthorizationError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, httpStatus.FORBIDDEN, errorCodes.FORBIDDEN);
  }
}

module.exports = AuthorizationError;