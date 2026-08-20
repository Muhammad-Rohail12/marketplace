import Select from '@/components/ui/Select';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Best Match' },
  { value: 'createdAt:desc', label: 'Newest' },
  { value: 'name:asc', label: 'Name: A to Z' },
];

// Full price/rating sort + faceted filters arrive in Phase 39
// (Advanced Filters & Sorting UI) — this phase ships a working basic
// sort control the results page already wires up end-to-end.
export default function SearchSortBar({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-neutral-500">Sort by</span>
      <Select id="search-sort" value={value} onChange={(e) => onChange(e.target.value)} options={SORT_OPTIONS} />
    </div>
  );
}