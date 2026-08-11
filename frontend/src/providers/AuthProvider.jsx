'use client';

import { useState, useCallback, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { tokenStorage } from '@/lib/tokenStorage';
import * as authService from '@/services/authService';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    authService
      .refreshSession()
      .then((res) => {
        if (isMounted) setUser(res.data.user);
      })
      .catch(() => {
        if (isMounted) {
          tokenStorage.clearAccessToken();
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials);
    setUser(res.data.user);
    return res;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}