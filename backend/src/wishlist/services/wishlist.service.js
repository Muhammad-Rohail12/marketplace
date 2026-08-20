const prisma = require('../../database/prismaClient');

const list = (userId) => prisma.wishlistItem.findMany({ where: { userId }, include: { product: { include: { media: { where: { isPrimary: true }, take: 1 }, pricing: { where: { variantId: null, isActive: true }, take: 1 } } } }, orderBy: { createdAt: 'desc' } });
const add = async (userId, productId) => prisma.wishlistItem.upsert({ where: { userId_productId: { userId, productId } }, update: {}, create: { userId, productId }, include: { product: true } });
const remove = (userId, productId) => prisma.wishlistItem.deleteMany({ where: { userId, productId } });

module.exports = { list, add, remove };
