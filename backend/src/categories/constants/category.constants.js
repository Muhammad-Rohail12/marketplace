module.exports = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 2000,
  SEO_TITLE_MAX_LENGTH: 70,
  SEO_DESCRIPTION_MAX_LENGTH: 160,
  SEO_KEYWORDS_MAX_LENGTH: 255,
  // Deliberately generous — spec calls for "unlimited nested
  // categories" while also wanting a configurable safety ceiling to
  // prevent runaway/accidental infinite trees.
  MAX_DEPTH: 6,
  ALLOWED_SORT_FIELDS: ['name', 'sortOrder', 'createdAt'],
};