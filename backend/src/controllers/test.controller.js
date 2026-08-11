const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/responseHandler');
const httpStatus = require('../constants/httpStatus');
const testService = require('../services/test.service');

const getTest = asyncHandler(async (req, res) => {
  const { message } = testService.getTestConnection();

  return sendSuccess(res, {
    statusCode: httpStatus.OK,
    message,
    data: {},
  });
});

module.exports = { getTest };