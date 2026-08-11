const { MILITARY_STATE_CODES, TERRITORY_STATE_CODES } = require('../constants/shipping.constants');

// Single source of truth for state -> zone mapping. Every service
// that needs a zone calls this rather than re-implementing the logic.
const resolveZoneFromState = (stateCode) => {
  const code = (stateCode || '').toUpperCase();
  if (code === 'AK') return 'ALASKA';
  if (code === 'HI') return 'HAWAII';
  if (MILITARY_STATE_CODES.includes(code)) return 'MILITARY';
  if (TERRITORY_STATE_CODES.includes(code)) return 'US_TERRITORIES';
  return 'CONTIGUOUS_US';
};

module.exports = { resolveZoneFromState };