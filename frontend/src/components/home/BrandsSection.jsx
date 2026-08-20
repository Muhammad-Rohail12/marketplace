'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Carousel from '@/components/ui/Carousel';
import BrandCard from '@/components/brand/BrandCard';
import Skeleton from '@/components/ui/Skeleton';
import { getFeaturedBrands, listBrands } from '@/services/brandService';

export default function BrandsSection() {
  const [featured, setFeatured] = useState(null);
  const [newArrivals, setNewArrivals] = useState(null);

  useEffect(() => {
    getFeaturedBrands().then((res) => setFeatured(res.data.brands)).catch(() => setFeatured([]));
    // "New Brand Arrivals" = real brands sorted by creation date —
    // no separate "new" flag exists on Brand (Phase 18), so recency
    // is the honest signal used here.
    listBrands({ sort: 'createdAt:desc', limit: 10 }).then((res) => setNewArrivals(res.data.brands)).catch(() => setNewArrivals([]));
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Top Brands</h2>
          <Link href="/brands" prefetch={false} className="text-sm font-medium text-primary-600 hover:underline">View all →</Link>
        </div>
        {featured === null ? (
          <div className="flex gap-4"> {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-24 shrink-0 rounded-lg" />)} </div>
        ) : featured.length === 0 ? (
          <p className="text-sm text-neutral-400">No featured brands yet.</p>
        ) : (
          <Carousel>
            {featured.map((b) => <div key={b.id} className="w-28 shrink-0"><BrandCard brand={b} /></div>)}
          </Carousel>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">New Brand Arrivals</h2>
        {newArrivals === null ? (
          <div className="flex gap-4"> {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-24 shrink-0 rounded-lg" />)} </div>
        ) : newArrivals.length === 0 ? (
          <p className="text-sm text-neutral-400">No brands yet.</p>
        ) : (
          <Carousel>
            {newArrivals.map((b) => <div key={b.id} className="w-28 shrink-0"><BrandCard brand={b} /></div>)}
          </Carousel>
        )}
      </section>
    </div>
  );
}