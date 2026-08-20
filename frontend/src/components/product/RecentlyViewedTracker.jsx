'use client';

import { useEffect } from 'react';
import { recordRecentlyViewed } from '@/utils/recentlyViewed';

// Silent client-side effect — records the current product into
// recently-viewed storage on mount. Rendered inside the server-
// component product page as a tiny client island, same "hydrate only
// what needs interactivity" approach used since Phase 40's split.
export default function RecentlyViewedTracker({ product }) {
  useEffect(() => {
    recordRecentlyViewed(product);
  }, [product]);

  return null;
}