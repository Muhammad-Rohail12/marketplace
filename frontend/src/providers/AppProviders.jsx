'use client';

import ThemeProvider from './ThemeProvider';
import AuthProvider from './AuthProvider';
import CartProvider from './CartProvider';

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}