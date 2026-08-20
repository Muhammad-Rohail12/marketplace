'use client';

import { useEffect, useState } from 'react';
import ProductGrid from '@/components/product/ProductGrid';
import Pagination from '@/components/ui/Pagination';
import { productService } from '@/services/productService';

export default function StoreProductsGrid({ storeId }) {
  const [products, setProducts] = useState(null);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProducts(null);
    productService.listByStore(storeId, { page, limit: 24 })
      .then((res) => { setProducts(res.data.products); setMeta(res.meta || { page: 1, totalPages: 1 }); })
      .catch(() => setProducts([]));
  }, [storeId, page]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Products from this store</h2>
      <ProductGrid products={products || []} isLoading={products === null} />
      {products && products.length > 0 && (
        <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}