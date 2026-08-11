// Generic Prisma "where" fragment builders. Resource-specific
// services compose these rather than hand-writing Prisma where
// clauses inline everywhere.
const buildRangeFilter = (min, max) => {
  const filter = {};
  if (min !== undefined && min !== null && min !== '') filter.gte = Number(min);
  if (max !== undefined && max !== null && max !== '') filter.lte = Number(max);
  return Object.keys(filter).length ? filter : undefined;
};

const buildTextSearchFilter = (query, fields = []) => {
  if (!query || !fields.length) return undefined;
  return {
    OR: fields.map((field) => ({ [field]: { contains: query, mode: 'insensitive' } })),
  };
};

module.exports = { buildRangeFilter, buildTextSearchFilter };