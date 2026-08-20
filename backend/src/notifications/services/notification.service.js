const prisma = require('../../database/prismaClient');

const listMine = async (userId, { unreadOnly = false } = {}) => prisma.notification.findMany({ where: { userId, ...(unreadOnly ? { readAt: null } : {}) }, orderBy: { createdAt: 'desc' }, take: 100 });
const markRead = (userId, id) => prisma.notification.updateMany({ where: { id, userId }, data: { readAt: new Date() } });
const markAllRead = (userId) => prisma.notification.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date() } });

module.exports = { listMine, markRead, markAllRead };
