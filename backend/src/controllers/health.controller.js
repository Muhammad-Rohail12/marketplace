const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');
const httpStatus = require('../constants/httpStatus');
const healthService = require('../services/health.service');

const getHealth = asyncHandler(async (req, res) => {
  const { message } = healthService.getHealthStatus();

  return sendSuccess(res, {
    statusCode: httpStatus.OK,
    message,
    data: {},
  });
});

module.exports = { getHealth };