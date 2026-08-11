'use client';

// Visual placeholder — real search logic arrives with Phase 31.
export default function SearchBar({ className = '' }) {
  return (
    <form role="search" className={className} onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="global-search" className="sr-only">
        Search products
      </label>
      <input
        id="global-search"
        type="search"
        placeholder="Search products..."
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:focus-ring dark:border-gray-700 dark:bg-transparent"
      />
    </form>
  );
}
