// Whitelists sortable fields per-resource to prevent arbitrary
// column sorting from user input (which could leak schema details
// or enable minor DoS via sorting on unindexed columns).
const resolveSort = (sortParam, allowedFields = [], defaultField = 'createdAt') => {
  if (!sortParam) return { [defaultField]: 'desc' };

  const [field, direction] = sortParam.split(':');
  const safeField = allowedFields.includes(field) ? field : defaultField;
  const safeDirection = direction === 'asc' ? 'asc' : 'desc';

  return { [safeField]: safeDirection };
};

module.exports = { resolveSort };