'use client';

import { createContext, useContext } from 'react';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
