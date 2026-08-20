'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageLoader from '@/components/feedback/PageLoader';
import EmptyState from '@/components/feedback/EmptyState';
import HotDealBanner from '@/components/deals/HotDealBanner';
import ProductCard from '@/components/product/ProductCard';
import { getDealsProducts } from '@/services/homepageProductAggregator';

export default function DealsPage() {
  const [deals, setDeals] = useState(null);

  useEffect(() => {
    getDealsProducts(24, { withEndDates: true }).then(setDeals).catch(() => setDeals([]));
  }, []);

  if (deals === null) return <MainLayout><PageLoader label="Loading deals..." /></MainLayout>;

  const sortedByDiscount = [...deals].sort((a, b) => (b.pricing?.discountPercentage || 0) - (a.pricing?.discountPercentage || 0));
  const topDeal = sortedByDiscount[0];
  const restDeals = sortedByDiscount.slice(1);

  return (
    <MainLayout>
      <div className="container-page flex flex-col gap-8 py-8">
        <div>
          <h1 className="text-2xl font-semibold">Today&apos;s Deals</h1>
          <p className="text-sm text-neutral-500">Real-time discounts across ZAF Cart.</p>
        </div>

        {deals.length === 0 ? (
          <EmptyState title="No active deals right now" message="Check back soon — sellers add new deals regularly." />
        ) : (
          <>
            {topDeal && <HotDealBanner product={topDeal} />}

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {restDeals.map((p) => <ProductCard key={p.id} product={p} variant="deal" />)}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}