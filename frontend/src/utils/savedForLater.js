// Local-only "Saved for Later" list — no backend model exists for
// this yet (same documented placeholder pattern as Phase 37's
// wishlist, Phase 41's recently-viewed, Phase 42's reviews). The
// actual cart-item REMOVAL when saving an item is real (calls the
// live cartService.removeItem) — only the "where did it go" memory
// is local, so nothing about real cart/inventory state is faked.
const STORAGE_KEY = 'marketplace_saved_for_later';

export function getSavedItems() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addSavedItem(item) {
  if (typeof window === 'undefined') return;
  const existing = getSavedItems().filter((i) => !(i.productId === item.productId && i.variantId === item.variantId));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([item, ...existing]));
}

export function removeSavedItem(productId, variantId) {
  if (typeof window === 'undefined') return;
  const next = getSavedItems().filter((i) => !(i.productId === productId && i.variantId === variantId));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}