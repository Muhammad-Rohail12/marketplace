import { FiX } from 'react-icons/fi';

export default function ReviewFilterChips({ filters, onFilterChange, onClearAll }) {
  const chips = [];
  if (filters.ratingFilter) chips.push({ key: 'ratingFilter', label: `${filters.ratingFilter}★ & up` });
  if (filters.withPhotos) chips.push({ key: 'withPhotos', label: 'With Photos' });
  if (filters.verifiedOnly) chips.push({ key: 'verifiedOnly', label: 'Verified' });
  if (filters.searchQuery) chips.push({ key: 'searchQuery', label: `"${filters.searchQuery}"` });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onFilterChange({ [chip.key]: chip.key === 'searchQuery' ? '' : false })}
          className="flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-400"
        >
          {chip.label} <FiX size={12} />
        </button>
      ))}
      <button type="button" onClick={onClearAll} className="text-xs font-medium text-neutral-500 underline hover:text-neutral-700">
        Clear all
      </button>
    </div>
  );
}