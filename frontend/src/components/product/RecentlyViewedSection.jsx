'use client';

import { useEffect, useState } from 'react';
import ProductRail from '@/components/home/ProductRail';
import { getRecentlyViewed } from '@/utils/recentlyViewed';

export default function RecentlyViewedSection({ excludeProductId }) {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    const items = getRecentlyViewed().filter((p) => p.id !== excludeProductId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProducts(items);
  }, [excludeProductId]);

  if (products === null || products.length === 0) return null;

  return <ProductRail title="Recently Viewed" products={products} isLoading={false} />;
}