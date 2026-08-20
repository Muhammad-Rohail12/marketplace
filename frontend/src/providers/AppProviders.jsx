'use client';

import ThemeProvider from './ThemeProvider';
import AuthProvider from './AuthProvider';
import CartProvider from './CartProvider';
import ToastProvider from './ToastProvider';

export default function AppProviders({ children }) {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}