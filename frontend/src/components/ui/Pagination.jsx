'use client';

// Visual placeholder only — pagination logic arrives with Phase 34.
export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange?.(currentPage - 1)}
        className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40 focus-visible:focus-ring"
      >
        Previous
      </button>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange?.(currentPage + 1)}
        className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40 focus-visible:focus-ring"
      >
        Next
      </button>
    </nav>
  );
}
