'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/feedback/EmptyState';
import { productService } from '@/services/productService';

export default function PendingProductsWidget() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    productService.listAll({ status: 'PENDING_REVIEW', limit: 5 })
      .then((res) => setProducts(res.data.products))
      .catch(() => setProducts([]));
  }, []);

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase text-neutral-500">Products Awaiting Review</h2>
        <Link href="/admin/products" className="text-xs font-medium text-primary-600 hover:underline">Review all →</Link>
      </div>
      {products === null ? (
        <p className="text-sm text-neutral-400">Loading...</p>
      ) : products.length === 0 ? (
        <EmptyState title="No products pending review" message="New product submissions will appear here." />
      ) : (
        <div className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-900">
          {products.map((p) => (
            <Link key={p.id} href="/admin/products" className="flex items-center justify-between py-2 text-sm">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-neutral-500">{p.seller?.user?.firstName} {p.seller?.user?.lastName} · {p.category?.name}</p>
              </div>
              <Badge variant="warning">Pending</Badge>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}