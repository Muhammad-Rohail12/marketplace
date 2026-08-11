const { resolvePagination } = require('../helpers/paginationHelper.helper');
const { SEARCH } = require('../constants/marketplace.constants');

// Normalizes raw query-string input into a consistent shape every
// future search/list endpoint can build on top of.
const parseSearchRequest = (query = {}) => {
  const rawQuery = (query.q || '').trim().slice(0, SEARCH.MAX_QUERY_LENGTH);
  const { page, limit, skip, take } = resolvePagination(query);

  return {
    query: rawQuery,
    filters: query.filters || {},
    sort: query.sort || null,
    page,
    limit,
    skip,
    take,
  };
};

module.exports = { parseSearchRequest };