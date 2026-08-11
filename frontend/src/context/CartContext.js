'use client';

import { createContext, useContext } from 'react';

export const CartContext = createContext({
  cartData: null,
  count: 0,
  isLoading: true,
  refreshCart: async () => {},
  addItem: async () => {},
  updateItem: async () => {},
  removeItem: async () => {},
  clearCart: async () => {},
});

export function useCart() {
  return useContext(CartContext);
}