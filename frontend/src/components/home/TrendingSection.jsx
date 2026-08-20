'use client';

import { useEffect, useState } from 'react';
import ProductRail from './ProductRail';
import { getTrendingProducts } from '@/services/homepageProductAggregator';

export default function TrendingSection() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    getTrendingProducts(10).then(setProducts).catch(() => setProducts([]));
  }, []);

  return <ProductRail title="Trending Now" products={products} isLoading={products === null} />;
}