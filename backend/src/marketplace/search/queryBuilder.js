const { parseSearchRequest } = require('./searchRequest.model');
const { buildFilterWhere } = require('./filterModel');
const { resolveSort } = require('./sortModel');

// Foundation query builder — future resource search services
// (Product search, etc.) call this to get a ready-to-use
// { where, orderBy, skip, take } object for prisma.<model>.findMany().
// allowedSortFields/searchFields are resource-specific and passed in
// by the caller, since this module has no knowledge of any real model yet.
const buildQuery = (rawQuery, { searchFields = [], allowedSortFields = [], defaultSortField = 'createdAt' } = {}) => {
  const parsed = parseSearchRequest(rawQuery);

  const where = buildFilterWhere({
    priceMin: parsed.filters.priceMin,
    priceMax: parsed.filters.priceMax,
    searchQuery: parsed.query,
    searchFields,
  });

  const orderBy = resolveSort(parsed.sort, allowedSortFields, defaultSortField);

  return {
    where,
    orderBy,
    skip: parsed.skip,
    take: parsed.take,
    page: parsed.page,
    limit: parsed.limit,
  };
};

module.exports = { buildQuery };