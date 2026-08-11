const handleError = require('../errors/errorHandler');

// Express requires exactly 4 args for an error-handling middleware.
const errorHandlerMiddleware = (err, req, res, next) => {
  handleError(err, req, res, next);
};

module.exports = errorHandlerMiddleware;