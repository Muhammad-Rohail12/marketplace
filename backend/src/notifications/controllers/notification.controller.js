const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess } = require('../../utils/responseHandler');
const service = require('../services/notification.service');

const list = asyncHandler(async (req, res) => sendSuccess(res, { message: 'Notifications retrieved', data: { notifications: await service.listMine(req.user.id, { unreadOnly: req.query.unreadOnly === 'true' }) } }));
const read = asyncHandler(async (req, res) => { await service.markRead(req.user.id, Number(req.params.id)); return sendSuccess(res, { message: 'Notification marked read' }); });
const readAll = asyncHandler(async (req, res) => { await service.markAllRead(req.user.id); return sendSuccess(res, { message: 'Notifications marked read' }); });

module.exports = { list, read, readAll };
