import { MARKETPLACE_CONSTANTS } from '../constants/marketplace.constants';

// Frontend counterpart to the backend's searchRequest.model.js —
// normalizes raw URL search params into the shape future list/search
// pages will build query strings from.
export function parseSearchParams(params = {}) {
  const page = Math.max(1, parseInt(params.page, 10) || MARKETPLACE_CONSTANTS.PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    MARKETPLACE_CONSTANTS.PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(params.limit, 10) || MARKETPLACE_CONSTANTS.PAGINATION.DEFAULT_LIMIT)
  );
  const q = (params.q || '').trim().slice(0, MARKETPLACE_CONSTANTS.SEARCH.MAX_QUERY_LENGTH);

  return { page, limit, q, sort: params.sort || null };
}