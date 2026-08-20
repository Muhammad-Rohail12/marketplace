'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Carousel from '@/components/ui/Carousel';
import Skeleton from '@/components/ui/Skeleton';
import { resolveImageSrc } from '@/utils/imageHelpers';
import { getFeaturedCategories, getHomepageCategories } from '@/services/categoryService';

export default function PopularCategoriesStrip() {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    // Prefer explicit homepage-flagged categories (Phase 17's
    // showOnHomepage); fall back to featured if none are flagged yet,
    // so this section isn't empty on a freshly-seeded catalog.
    getHomepageCategories()
      .then((res) => (res.data.categories.length ? res.data.categories : getFeaturedCategories().then((r) => r.data.categories)))
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  if (categories === null) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 w-28 shrink-0 rounded-full" />)}
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Shop Popular Categories</h2>
      <Carousel>
        {categories.map((c) => (
          <Link key={c.id} href={`/categories/${c.slug}`} className="flex w-28 shrink-0 flex-col items-center gap-2 text-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-50 transition-shadow hover:shadow-elevated dark:border-neutral-800 dark:bg-neutral-900">
              {c.image || c.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resolveImageSrc(c.image || c.icon)} alt={c.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl font-semibold text-neutral-300">{c.name[0]}</span>
              )}
            </div>
            <span className="text-xs font-medium">{c.name}</span>
          </Link>
        ))}
      </Carousel>
    </section>
  );
}