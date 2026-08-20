import Rating from '@/components/ui/Rating';

export default function ReviewRatingSummary({ stats, onFilterByStar }) {
  if (stats.total === 0) {
    return (
      <div className="flex flex-col items-center gap-1 py-6 text-center">
        <p className="text-sm font-medium text-neutral-500">No ratings yet</p>
        <p className="text-xs text-neutral-400">Be the first to review this product.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
      <div className="flex flex-col items-center gap-1 sm:items-start">
        <p className="text-4xl font-bold">{stats.average}</p>
        <Rating value={stats.average} showCount={false} size={18} />
        <p
          className="text-sm text-neutral-500"
          aria-label={`Overall rating ${stats.average} out of 5 from ${stats.total} ratings`}
        >
          {stats.total.toLocaleString()} ratings
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        {stats.distribution.map((row) => (
          <button
            key={row.star}
            type="button"
            onClick={() => onFilterByStar(row.star)}
            className="flex items-center gap-2 text-left text-sm hover:opacity-80 focus-visible:focus-ring"
            aria-label={`${row.star}-star reviews: ${row.percentage} percent`}
          >
            <span className="w-10 shrink-0 text-neutral-500">{row.star} star</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <span className="block h-full rounded-full bg-warning-500" style={{ width: `${row.percentage}%` }} />
            </span>
            <span className="w-10 shrink-0 text-right text-neutral-400">{row.percentage}%</span>
          </button>
        ))}
      </div>
    </div>
  );
}