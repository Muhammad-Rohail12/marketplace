'use client';

import { useEffect, useState } from 'react';
import ProductRail from './ProductRail';
import { getDealsProducts } from '@/services/homepageProductAggregator';

export default function DealsSection() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    getDealsProducts(10).then(setProducts).catch(() => setProducts([]));
  }, []);

  return (
    <ProductRail
      title="🔥 Today's Deals"
      products={products}
      isLoading={products === null}
      viewAllHref="/deals"
      emptyHint="No active deals right now — check back soon."
    />
  );
}