'use client';

import { useEffect, useState } from 'react';
import ProductRail from '@/components/home/ProductRail';
import { productService } from '@/services/productService';

// Real products — pulled from the same categories already present
// in the cart's own line items, not fabricated. Same honest-data
// approach as Phase 35's homepage rails.
export default function CartRecommendations({ sellerGroups }) {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    const cartProductIds = new Set(sellerGroups.flatMap((g) => g.items.map((i) => i.productId)));
    const categoryIds = [...new Set(sellerGroups.flatMap((g) => g.items.map((i) => i.product.categoryId)).filter(Boolean))];

    if (categoryIds.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProducts([]);
      return;
    }

    productService.listByCategory(categoryIds[0], { limit: 10 })
      .then((res) => setProducts((res.data.products || []).filter((p) => !cartProductIds.has(p.id))))
      .catch(() => setProducts([]));
  }, [sellerGroups]);

  if (products === null || products.length === 0) return null;

  return <ProductRail title="You Might Also Need" products={products} isLoading={false} />;
}