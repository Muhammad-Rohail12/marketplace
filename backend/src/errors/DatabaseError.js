const AppError = require('./AppError');
const httpStatus = require('../constants/httpStatus');
const errorCodes = require('../constants/errorCodes');

// Placeholder — will wrap unexpected Prisma errors once database
// queries exist in business-logic phases.
class DatabaseError extends AppError {
  constructor(message = 'A database error occurred') {
    super(message, httpStatus.INTERNAL_SERVER_ERROR, errorCodes.DATABASE_ERROR);
    this.isOperational = false; // treated as unexpected, logged loudly
  }
}

module.exports = DatabaseError;