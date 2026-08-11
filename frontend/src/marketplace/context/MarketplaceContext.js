'use client';

import { createContext, useContext } from 'react';

// Foundation only — no provider mounts this yet since there's no
// shared marketplace state (cart, wishlist, etc.) to hold until
// those phases exist. Establishes the pattern future providers follow.
export const MarketplaceContext = createContext(null);

export function useMarketplace() {
  return useContext(MarketplaceContext);
}