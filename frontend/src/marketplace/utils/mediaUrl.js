import { apiConfig } from '@/config/api.config';

// Mirrors backend/src/marketplace/helpers/mediaUrlHelper.helper.js —
// resolves a stored relative path into a full browser-loadable URL.
export function buildMediaUrl(relativePath) {
  if (!relativePath) return null;
  if (relativePath.startsWith('http')) return relativePath;

  const backendOrigin = apiConfig.baseUrl.replace(/\/api\/?$/, '');
  const normalizedPath = relativePath.startsWith('/') ? relativePath : `/uploads/${relativePath}`;
  return `${backendOrigin}${normalizedPath}`;
}