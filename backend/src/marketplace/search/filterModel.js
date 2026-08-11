const { buildRangeFilter, buildTextSearchFilter } = require('../helpers/filteringHelper.helper');

// Generic filter shape: { priceMin, priceMax, category, searchFields }
// Resource-specific search services extend/compose this rather than
// each inventing their own filter object structure.
const buildFilterWhere = ({ priceMin, priceMax, searchQuery, searchFields = [] } = {}) => {
  const where = {};

  const priceFilter = buildRangeFilter(priceMin, priceMax);
  if (priceFilter) where.price = priceFilter;

  const textFilter = buildTextSearchFilter(searchQuery, searchFields);
  if (textFilter) Object.assign(where, textFilter);

  return where;
};

module.exports = { buildFilterWhere };