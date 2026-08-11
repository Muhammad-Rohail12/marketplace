const sendSuccess = (res, { statusCode = 200, message = 'Success', data = {}, meta = {} } = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    requestId: res.req?.requestId,
    timestamp: new Date().toISOString(),
    meta,
  });
};

const sendError = (res, { statusCode = 500, message = 'Internal server error', errors = [], errorCode } = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    errorCode,
    requestId: res.req?.requestId,
    timestamp: new Date().toISOString(),
  });
};

module.exports = { sendSuccess, sendError };