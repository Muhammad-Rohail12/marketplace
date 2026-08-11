const ZONE_CODES = ['CONTIGUOUS_US', 'ALASKA', 'HAWAII', 'US_TERRITORIES', 'MILITARY'];

// Not currently reachable — Phase 27's US_STATES list has no military
// state codes (AA/AE/AP) yet, so no address can resolve to MILITARY
// today. Mapping is here now so this phase's zone architecture doesn't
// need to change when Phase 27 is later extended to accept them.
const MILITARY_STATE_CODES = ['AA', 'AE', 'AP'];
const TERRITORY_STATE_CODES = ['PR']; // GU/VI/AS/MP not yet in Phase 27's state list

const LIMITS = {
  MAX_FLAT_RATE: 500,
  NAME_MAX: 100,
  DESCRIPTION_MAX: 500,
  CODE_MAX: 40,
  MIN_DAYS_MAX: 60,
};

module.exports = { ZONE_CODES, MILITARY_STATE_CODES, TERRITORY_STATE_CODES, LIMITS };