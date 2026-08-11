module.exports = {
  STATUS: { DRAFT: 'DRAFT', ACTIVE: 'ACTIVE', INACTIVE: 'INACTIVE', SUSPENDED: 'SUSPENDED', CLOSED: 'CLOSED' },
  POLICY_TYPES: ['RETURN', 'SHIPPING', 'CANCELLATION', 'PRIVACY', 'TERMS'],
  FIELD_LIMITS: {
    NAME_MAX: 150,
    SHORT_DESCRIPTION_MAX: 200,
    DESCRIPTION_MAX: 3000,
    ADDRESS_MAX: 255,
    CITY_MAX: 100,
    STATE_MAX: 100,
    COUNTRY_MAX: 100,
    POSTAL_CODE_MAX: 20,
    SEO_TITLE_MAX: 70,
    SEO_DESCRIPTION_MAX: 160,
    POLICY_CONTENT_MAX: 5000,
  },
  // Statuses a seller may never set directly — reserved for admin
  // transitions only (suspend/activate/close endpoints).
  SELLER_FORBIDDEN_STATUSES: ['SUSPENDED', 'CLOSED'],
};