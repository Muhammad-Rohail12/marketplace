const LABELS = ['HOME', 'WORK', 'OTHER'];

const LIMITS = {
  NAME_MAX: 100,
  COMPANY_MAX: 150,
  ADDRESS_LINE_MAX: 255,
  CITY_MAX: 100,
  INSTRUCTIONS_MAX: 500,
  MAX_ADDRESSES_PER_USER: 50,
};

// 5-digit ZIP or ZIP+4 (e.g. "90210" or "90210-1234")
const ZIP_REGEX = /^\d{5}(-\d{4})?$/;

// US phone: accepts common formats, normalizes to E.164-ish +1XXXXXXXXXX
// server-side. Not overly strict about dashes/parens/spaces on input.
const PHONE_REGEX = /^\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

const DEFAULT_COUNTRY_CODE = 'US';

module.exports = { LABELS, LIMITS, ZIP_REGEX, PHONE_REGEX, DEFAULT_COUNTRY_CODE };