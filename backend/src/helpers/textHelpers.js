const generateSlug = (text = '') =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const capitalize = (text = '') =>
  text.length ? text.charAt(0).toUpperCase() + text.slice(1) : text;

const truncateText = (text = '', maxLength = 100) =>
  text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;

module.exports = { generateSlug, capitalize, truncateText };