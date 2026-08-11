const Currency = require('../enums/currency.enum');

module.exports = {
  DEFAULT_CURRENCY: Currency.USD,

  PRODUCT: {
    NAME_MIN_LENGTH: 3,
    NAME_MAX_LENGTH: 150,
    DESCRIPTION_MAX_LENGTH: 5000,
    MAX_IMAGES: 8,
    MIN_PRICE: 0.01,
    MAX_PRICE: 1000000,
  },

  SKU: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 40,
  },

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  SEARCH: {
    MAX_QUERY_LENGTH: 100,
    MIN_QUERY_LENGTH: 1,
  },

  RATING: {
    MIN: 1,
    MAX: 5,
  },

  DISCOUNT: {
    MIN_PERCENTAGE: 1,
    MAX_PERCENTAGE: 90,
  },

  INVENTORY: {
    LOW_STOCK_THRESHOLD: 5,
  },

  TAX: {
    // Placeholder rate — real tax logic arrives with a future
    // Checkout/Tax phase. Kept centralized so nothing hardcodes 0 elsewhere.
    DEFAULT_RATE_PERCENTAGE: 0,
  },
};