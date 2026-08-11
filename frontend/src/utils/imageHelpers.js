import { apiConfig } from '@/config/api.config';

export function getImageFallback() {
  return '/placeholder-image.png';
}

// Backend returns paths like "/uploads/profile-images/xyz.jpg" — this
// prefixes them with the backend's origin (stripping the trailing
// "/api") since Next.js otherwise resolves relative paths against its
// own origin (localhost:3000), not the backend's (localhost:5000).
export function resolveImageSrc(src) {
  if (!src) return getImageFallback();
  if (src.startsWith('http')) return src;

  const backendOrigin = apiConfig.baseUrl.replace(/\/api\/?$/, '');
  return `${backendOrigin}${src}`;
}