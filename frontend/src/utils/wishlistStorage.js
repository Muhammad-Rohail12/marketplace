// Local-only wishlist — same documented placeholder pattern as
// recentSearches.js (33) / recentlyViewed.js (41) / savedForLater.js
// (43). Previously stored only bare productIds (Phase 37), which was
// enough for the toggle heart button but made a real Wishlist LISTING
// page impossible (no public "get products by IDs" endpoint exists).
// Now stores the same minimal display object savedForLater.js
// already uses — a real fix, not a new fake data source.
const STORAGE_KEY = 'marketplace_wishlist';

export function getWishlistItems() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getWishlistIds() {
  return getWishlistItems().map((i) => i.productId);
}

export function isWishlisted(productId) {
  return getWishlistIds().includes(productId);
}

// Accepts either a full product object (preferred — enables listing)
// or a bare id (legacy callers still work, just without display data).
export function toggleWishlist(productOrId) {
  const product = typeof productOrId === 'object' ? productOrId : { id: productOrId };
  const current = getWishlistItems();
  const exists = current.some((i) => i.productId === product.id);

  if (exists) {
    const next = current.filter((i) => i.productId !== product.id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return false;
  }

  const primaryImage = product.media?.find((m) => m.isPrimary) || product.media?.[0];
  const entry = {
    productId: product.id,
    slug: product.slug || null,
    name: product.name || null,
    imageUrl: primaryImage?.url || null,
    price: product.pricing?.hasPrice ? product.pricing.effectivePrice : null,
    currency: product.pricing?.currency || 'USD',
    addedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...current]));
  return true;
}

export function removeFromWishlist(productId) {
  const next = getWishlistItems().filter((i) => i.productId !== productId);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}