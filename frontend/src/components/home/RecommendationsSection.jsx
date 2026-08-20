'use client';

import { useEffect, useState } from 'react';
import ProductRail from './ProductRail';
import { getRecommendedProducts } from '@/services/homepageProductAggregator';
import { useAuth } from '@/context/AuthContext';

export default function RecommendationsSection() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState(null);

  useEffect(() => {
    getRecommendedProducts(10).then(setProducts).catch(() => setProducts([]));
  }, []);

  const title = isAuthenticated ? 'Recommended for You' : 'You Might Like';

  return <ProductRail title={title} products={products} isLoading={products === null} />;
}