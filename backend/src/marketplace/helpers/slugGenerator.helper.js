// Reuses the same normalization rules as backend/src/helpers/textHelpers.js
// (Phase 5) but lives here too so marketplace code depends only on
// the marketplace module, not reaching into unrelated folders.
const generateSlug = (text = '') =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

module.exports = { generateSlug };