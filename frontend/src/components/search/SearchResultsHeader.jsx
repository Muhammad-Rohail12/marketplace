export default function SearchResultsHeader({ query, count, isLoading }) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-xl font-semibold">
        {query ? <>Results for &ldquo;{query}&rdquo;</> : 'Search'}
      </h1>
      {!isLoading && <p className="text-sm text-neutral-500">{count} {count === 1 ? 'result' : 'results'}</p>}
    </div>
  );
}