const { PAGINATION } = require('../constants/marketplace.constants');

// Converts { page, limit } query params into Prisma's { skip, take },
// clamped to safe bounds. Every future list endpoint should route
// through this instead of computing skip/take inline.
const resolvePagination = ({ page, limit } = {}) => {
  const safePage = Math.max(1, parseInt(page, 10) || PAGINATION.DEFAULT_PAGE);
  const safeLimit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(limit, 10) || PAGINATION.DEFAULT_LIMIT)
  );

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  };
};

const buildPaginationMeta = ({ page, limit, totalCount }) => ({
  page,
  limit,
  totalCount,
  totalPages: Math.ceil(totalCount / limit) || 1,
  hasNextPage: page * limit < totalCount,
  hasPreviousPage: page > 1,
});

module.exports = { resolvePagination, buildPaginationMeta };