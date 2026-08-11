'use client';

import { useState, useCallback } from 'react';
import { parseSearchParams } from '../utils/searchParams';

// Foundation hook — manages search/filter/sort/pagination state in a
// consistent shape. Real product-search pages will consume this
// once they exist; not wired to any page yet.
export function useSearchQuery(initialParams = {}) {
  const [params, setParams] = useState(() => parseSearchParams(initialParams));

  const updateParams = useCallback((updates) => {
    setParams((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetParams = useCallback(() => {
    setParams(parseSearchParams({}));
  }, []);

  return { params, updateParams, resetParams };
}