const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const httpStatus = require('../../constants/httpStatus');
const adminUserService = require('../services/adminUser.service');

const listUsers = asyncHandler(async (req, res) => {
  const { items, meta } = await adminUserService.listUsers(req.query);
  return sendSuccess(res, { statusCode: httpStatus.OK, message: 'Users retrieved', data: { users: items }, meta });
});

module.exports = { listUsers };