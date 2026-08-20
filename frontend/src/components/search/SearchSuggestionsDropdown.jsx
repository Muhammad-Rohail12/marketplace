'use client';

import Link from 'next/link';
import { FiClock, FiTrendingUp, FiSearch, FiX } from 'react-icons/fi';
import { resolveImageSrc } from '@/utils/imageHelpers';
import { formatMoney } from '@/utils/currencyFormat';

export default function SearchSuggestionsDropdown({
  query, recentSearches, onClearRecent, onSelectTerm,
  products, categories, brands, isLoading,
}) {
  const hasQuery = query.trim().length > 0;
  const hasResults = products.length > 0 || categories.length > 0 || brands.length > 0;

  return (
    <div className="absolute left-0 top-full z-40 mt-1 w-full rounded-lg border border-neutral-200 bg-white py-2 shadow-dropdown dark:border-neutral-800 dark:bg-neutral-900">
      {!hasQuery && (
        <>
          {recentSearches.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center justify-between px-4 py-1">
                <span className="text-2xs font-semibold uppercase text-neutral-400">Recent Searches</span>
                <button type="button" onClick={onClearRecent} className="text-2xs text-neutral-400 hover:text-danger-500">Clear</button>
              </div>
              {recentSearches.map((term) => (
                <button key={term} type="button" onClick={() => onSelectTerm(term)} className="flex w-full items-center gap-2 px-4 py-1.5 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  <FiClock size={14} className="text-neutral-400" /> {term}
                </button>
              ))}
            </div>
          )}
          <div>
            <span className="block px-4 py-1 text-2xs font-semibold uppercase text-neutral-400">Trending</span>
            {onSelectTerm && require('@/utils/recentSearches').TRENDING_SEARCHES.map((term) => (
              <button key={term} type="button" onClick={() => onSelectTerm(term)} className="flex w-full items-center gap-2 px-4 py-1.5 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
                <FiTrendingUp size={14} className="text-neutral-400" /> {term}
              </button>
            ))}
          </div>
        </>
      )}

      {hasQuery && isLoading && (
        <p className="px-4 py-3 text-sm text-neutral-500">Searching...</p>
      )}

      {hasQuery && !isLoading && !hasResults && (
        <p className="px-4 py-3 text-sm text-neutral-500">No matches for &ldquo;{query}&rdquo;</p>
      )}

      {hasQuery && !isLoading && hasResults && (
        <>
          {categories.length > 0 && (
            <div className="mb-1">
              <span className="block px-4 py-1 text-2xs font-semibold uppercase text-neutral-400">Categories</span>
              {categories.map((c) => (
                <Link key={c.id} href={`/categories/${c.slug}`} className="block px-4 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  In <span className="font-medium">{c.name}</span>
                </Link>
              ))}
            </div>
          )}

          {brands.length > 0 && (
            <div className="mb-1">
              <span className="block px-4 py-1 text-2xs font-semibold uppercase text-neutral-400">Brands</span>
              {brands.map((b) => (
                <Link key={b.id} href={`/brands/${b.slug}`} className="block px-4 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  {b.name}
                </Link>
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div>
              <span className="block px-4 py-1 text-2xs font-semibold uppercase text-neutral-400">Products</span>
              {products.map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.media?.[0]?.url ? resolveImageSrc(p.media[0].url) : '/placeholder-image.png'}
                    alt=""
                    className="h-8 w-8 rounded object-cover"
                  />
                  <span className="flex-1 truncate">{p.name}</span>
                  {p.pricing?.hasPrice && <span className="text-xs font-medium">{formatMoney(p.pricing.effectivePrice, p.pricing.currency)}</span>}
                </Link>
              ))}
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className="mt-1 flex items-center gap-2 border-t border-neutral-100 px-4 py-2 text-sm font-medium text-primary-600 dark:border-neutral-800"
              >
                <FiSearch size={14} /> See all results for &ldquo;{query}&rdquo;
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}