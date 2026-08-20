'use client';

import Link from 'next/link';
import Carousel from '@/components/ui/Carousel';
import ProductCard from '@/components/product/ProductCard';
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton';

export default function ProductRail({ title, products, isLoading, viewAllHref, emptyHint }) {
  if (!isLoading && (!products || products.length === 0)) {
    return emptyHint ? (
      <section className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-400 dark:border-neutral-700">
        {emptyHint}
      </section>
    ) : null;
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm font-medium text-primary-600 hover:underline">View all →</Link>
        )}
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-44 shrink-0 sm:w-52"><ProductCardSkeleton /></div>
          ))}
        </div>
      ) : (
        <Carousel>
          {products.map((p) => (
            <div key={p.id} className="w-44 shrink-0 sm:w-52">
              <ProductCard product={p} />
            </div>
          ))}
        </Carousel>
      )}
    </section>
  );
}