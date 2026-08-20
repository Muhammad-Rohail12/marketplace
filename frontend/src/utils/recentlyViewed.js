// Local-only, per-browser — same documented placeholder pattern as
// Phase 33's recentSearches.js and Phase 37's wishlistStorage.js. A
// real account-synced "recently viewed" (or server-side view
// tracking for genuine Trending signals — see Phase 35's note) is
// backend work for a later phase; this keeps the UI fully functional
// today with zero backend dependency.
const STORAGE_KEY = 'marketplace_recently_viewed';
const MAX_ITEMS = 12;

export function getRecentlyViewed() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function recordRecentlyViewed(product) {
  if (typeof window === 'undefined' || !product?.id) return;
  const minimal = { id: product.id, slug: product.slug, name: product.name, media: product.media, brand: product.brand, pricing: product.pricing };
  const existing = getRecentlyViewed().filter((p) => p.id !== product.id);
  const updated = [minimal, ...existing].slice(0, MAX_ITEMS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}