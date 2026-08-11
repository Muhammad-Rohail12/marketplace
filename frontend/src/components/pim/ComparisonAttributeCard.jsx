// Foundation only — used by a future Product Comparison feature.
export default function ComparisonAttributeCard({ attributeName, values = [] }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
      <p className="mb-2 text-xs font-semibold uppercase text-gray-500">{attributeName}</p>
      <div className="flex gap-4">
        {values.map((v, i) => (
          <span key={i} className="text-sm">{v ?? '—'}</span>
        ))}
      </div>
    </div>
  );
}