'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

// Reads/writes filter state directly to/from the URL query string so
// filtered views are shareable and bookmarkable (roadmap-implied
// requirement for a "professional" listing experience). Single hook
// reused by both /categories/[slug] and /search — no duplicated
// filter-state logic across pages.
export function useUrlFilters(defaults = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const result = { ...defaults };
    for (const [key, value] of searchParams.entries()) {
      if (key === 'brands') result.brands = value.split(',').filter(Boolean).map(Number);
      else if (key === 'page') result.page = Number(value) || 1;
      else result[key] = value;
    }
    return result;
  }, [searchParams, defaults]);

  const setFilters = useCallback((updates, { resetPage = true } = {}) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      const isEmpty = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
      if (isEmpty) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else {
        params.set(key, String(value));
      }
    });

    if (resetPage) params.delete('page');

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const clearAll = useCallback((preserveKeys = []) => {
    const params = new URLSearchParams();
    preserveKeys.forEach((k) => {
      const v = searchParams.get(k);
      if (v) params.set(k, v);
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  return { filters, setFilters, clearAll };
}