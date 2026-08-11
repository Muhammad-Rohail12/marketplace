const AppError = require('./AppError');
const httpStatus = require('../constants/httpStatus');
const errorCodes = require('../constants/errorCodes');

class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = []) {
    super(message, httpStatus.UNPROCESSABLE_ENTITY, errorCodes.VALIDATION_FAILED, errors);
  }
}

module.exports = ValidationError;