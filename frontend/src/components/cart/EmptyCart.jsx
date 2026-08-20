'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import ProductRail from '@/components/home/ProductRail';
import { getTrendingProducts } from '@/services/homepageProductAggregator';
import { ROUTES } from '@/constants/routes';

export default function EmptyCart() {
  const [trending, setTrending] = useState(null);

  useEffect(() => {
    getTrendingProducts(10).then(setTrending).catch(() => setTrending([]));
  }, []);

  return (
    <div className="flex flex-col items-center gap-10 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <FiShoppingCart size={56} className="text-neutral-300" />
        <div>
          <h2 className="text-lg font-semibold">Your cart is empty</h2>
          <p className="mt-1 text-sm text-neutral-500">You haven&apos;t added anything yet.</p>
        </div>
        <Link href={ROUTES.PRODUCTS}>
          <Button>Continue Shopping</Button>
        </Link>
      </div>

      {trending && trending.length > 0 && (
        <div className="w-full">
          <ProductRail title="Trending Now" products={trending} isLoading={false} />
        </div>
      )}
    </div>
  );
}