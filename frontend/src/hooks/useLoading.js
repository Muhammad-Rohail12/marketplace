'use client';

import { useState, useCallback } from 'react';

export function useLoading(initial = false) {
  const [isLoading, setIsLoading] = useState(initial);

  const withLoading = useCallback(async (fn) => {
    setIsLoading(true);
    try {
      return await fn();
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, setIsLoading, withLoading };
}