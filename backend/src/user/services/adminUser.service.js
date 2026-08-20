const prisma = require('../../database/prismaClient');
const { marketplace } = { marketplace: require('../../marketplace') };

const listUsers = async ({ page, limit, search, role, status } = {}) => {
  const { resolvePagination, buildPaginationMeta } = marketplace.helpers.pagination;
  const { skip, take, page: safePage, limit: safeLimit } = resolvePagination({ page, limit });
  const where = {
    ...(role ? { role } : {}),
    ...(status ? { status } : {}),
    ...(search ? {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    } : {}),
  };
  const select = {
    id: true, firstName: true, lastName: true, email: true,
    role: true, status: true, emailVerified: true, createdAt: true, lastLoginAt: true,
  };

  const [items, totalCount] = await Promise.all([
    prisma.user.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take, select }),
    prisma.user.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta({ page: safePage, limit: safeLimit, totalCount }) };
};

module.exports = { listUsers };