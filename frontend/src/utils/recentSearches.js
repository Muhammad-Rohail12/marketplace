// Client-side only — recent searches are a per-browser convenience,
// not user account data, so no backend/localStorage-in-artifact
// concerns apply here (this is a real Next.js app, not an artifact).
const STORAGE_KEY = 'marketplace_recent_searches';
const MAX_ITEMS = 8;

export function getRecentSearches() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addRecentSearch(term) {
  if (typeof window === 'undefined' || !term.trim()) return;
  const existing = getRecentSearches().filter((t) => t.toLowerCase() !== term.trim().toLowerCase());
  const updated = [term.trim(), ...existing].slice(0, MAX_ITEMS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearRecentSearches() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

// Static list — real trending data needs backend search-analytics
// (out of scope until Phase 55). Kept minimal and clearly labeled.
export const TRENDING_SEARCHES = ['Wireless earbuds', 'Running shoes', 'Coffee maker', 'Smart watch', 'Backpack'];