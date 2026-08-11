'use client';

import { useCallback, useEffect, useState } from 'react';

export function useApi(apiFn, { immediate = true } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(immediate);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  useEffect(() => {
    if (!immediate) {
      return;
    }

    const timeoutId = setTimeout(() => {
      execute();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [immediate, execute]);

  return { data, error, loading, execute };
}