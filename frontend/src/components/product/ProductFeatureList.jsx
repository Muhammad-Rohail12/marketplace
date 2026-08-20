// Renders the GENERAL specification group (Phase 22) as bullet
// points — the roadmap's "About this item" / "Features" requirement,
// built from real seller-entered data, never placeholder text.
export default function ProductFeatureList({ specifications = [] }) {
  const general = specifications.filter((s) => s.group === 'GENERAL');
  if (general.length === 0) return null;

  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold uppercase text-neutral-500">About This Item</h2>
      <ul className="flex flex-col gap-1.5">
        {general.map((s, i) => (
          <li key={i} className="flex gap-2 text-sm text-neutral-700 dark:text-neutral-300">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
            <span><strong className="font-medium">{s.label}:</strong> {s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}