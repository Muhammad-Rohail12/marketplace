import Select from '@/components/ui/Select';

export const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest' },
  { value: 'name:asc', label: 'Name: A to Z' },
  { value: 'name:desc', label: 'Name: Z to A' },
];

export default function CategoryListingHeader({ category, count, sort, onSortChange }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-neutral-200 pb-4 dark:border-neutral-800">
      <div>
        <h1 className="text-2xl font-semibold">{category.name}</h1>
        {category.description && <p className="mt-1 max-w-xl text-sm text-neutral-500">{category.description}</p>}
        <p className="mt-1 text-sm text-neutral-400">{count} {count === 1 ? 'product' : 'products'}</p>
      </div>
      <Select id="category-sort" value={sort} onChange={(e) => onSortChange(e.target.value)} options={SORT_OPTIONS} />
    </div>
  );
}