'use client';

import Link from 'next/link';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import PriceRangeSlider from '@/components/ui/PriceRangeSlider';

export default function CategorySidebarFilters({
  subcategories = [], activeSubcategorySlug,
  brands, selectedBrandIds, onToggleBrand,
  priceRange, priceBounds, onPriceChange,
  onClearAll,
}) {
  const hasActiveFilters = selectedBrandIds.length > 0 || (priceRange && (priceRange[0] > priceBounds.min || priceRange[1] < priceBounds.max));

  return (
    <div className="flex flex-col gap-6">
      {subcategories.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold">Category</h3>
          <ul className="flex flex-col gap-1">
            {subcategories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/categories/${c.slug}`}
                  className={`block rounded-md px-2 py-1 text-sm ${activeSubcategorySlug === c.slug ? 'bg-primary-50 font-medium text-primary-700 dark:bg-primary-500/10' : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800'}`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {brands.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold">Brand</h3>
          <div className="flex flex-col gap-1.5">
            {brands.map((b) => (
              <Checkbox
                key={b.id}
                id={`brand-${b.id}`}
                label={b.name}
                checked={selectedBrandIds.includes(b.id)}
                onChange={() => onToggleBrand(b.id)}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-2 text-sm font-semibold">Price</h3>
        <PriceRangeSlider min={priceBounds.min} max={priceBounds.max} value={priceRange} onChange={onPriceChange} />
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClearAll} className="self-start">Clear all filters</Button>
      )}
    </div>
  );
}