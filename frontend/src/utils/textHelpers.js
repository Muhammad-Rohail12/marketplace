export function generateSlug(text = '') {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function capitalize(text = '') {
  return text.length ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

export function truncateText(text = '', maxLength = 100) {
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
}