const STATUS = { ACTIVE: 'ACTIVE', ABANDONED: 'ABANDONED', CONVERTED: 'CONVERTED', EXPIRED: 'EXPIRED' };

const LIMITS = {
  MAX_QUANTITY_PER_LINE: 999, // sanity ceiling independent of inventory — guards against integer-injection style input
  MAX_LINES_PER_CART: 200,
};

// Per spec's explicit decision requirement: cart count = TOTAL UNITS
// across all lines, not unique line count. Documented here as the
// single source of truth so frontend and backend never disagree.
const COUNT_MODE = 'TOTAL_UNITS';

module.exports = { STATUS, LIMITS, COUNT_MODE };