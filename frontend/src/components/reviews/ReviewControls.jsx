'use client';

import { FiSearch, FiX } from 'react-icons/fi';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';

const SORT_OPTIONS = [
  { value: 'most-helpful', label: 'Most Helpful' },
  { value: 'most-recent', label: 'Most Recent' },
  { value: 'highest-rated', label: 'Highest Rating' },
  { value: 'lowest-rated', label: 'Lowest Rating' },
  { value: 'with-photos', label: 'With Photos' },
];

export default function ReviewControls({ filters, onFilterChange, sortBy, onSortChange }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
          <Input
            id="review-search"
            placeholder="Search reviews..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="pl-8"
          />
          {filters.searchQuery && (
            <button type="button" onClick={() => onFilterChange({ searchQuery: '' })} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400">
              <FiX size={14} />
            </button>
          )}
        </div>
        <Select id="review-sort" value={sortBy} onChange={(e) => onSortChange(e.target.value)} options={SORT_OPTIONS} />
      </div>

      <div className="flex flex-wrap gap-3">
        {[5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onFilterChange({ ratingFilter: filters.ratingFilter === star ? null : star })}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${filters.ratingFilter === star ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-500/10' : 'border-neutral-300 dark:border-neutral-700'}`}
          >
            {star}★ &amp; up
          </button>
        ))}
        <Checkbox id="filter-photos" label="With Photos" checked={filters.withPhotos} onChange={(e) => onFilterChange({ withPhotos: e.target.checked })} />
        <Checkbox id="filter-verified" label="Verified Purchase" checked={filters.verifiedOnly} onChange={(e) => onFilterChange({ verifiedOnly: e.target.checked })} />
      </div>
    </div>
  );
}