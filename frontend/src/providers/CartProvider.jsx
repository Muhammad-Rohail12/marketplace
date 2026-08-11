'use client';

import { useState, useCallback, useEffect } from 'react';
import { CartContext } from '@/context/CartContext';
import { cartService } from '@/services/cartService';
import { useAuth } from '@/context/AuthContext';

export default function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cartData, setCartData] = useState(null);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const applyCartResult = useCallback((result) => {
    setCartData(result);
    setCount(result.summary.totalUnits);
  }, []);

  const refreshCart = useCallback(async (preFetched) => {
    if (preFetched) {
      applyCartResult(preFetched);
      return;
    }
    if (!isAuthenticated) {
      setCartData(null);
      setCount(0);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await cartService.get();
      applyCartResult(res.data);
    } catch {
      setCartData(null);
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, applyCartResult]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const addItem = useCallback(async (data) => {
    const res = await cartService.addItem(data);
    applyCartResult(res.data);
    return res;
  }, [applyCartResult]);

  const updateItem = useCallback(async (itemId, quantity) => {
    const res = await cartService.updateItem(itemId, quantity);
    applyCartResult(res.data);
    return res;
  }, [applyCartResult]);

  const removeItem = useCallback(async (itemId) => {
    const res = await cartService.removeItem(itemId);
    applyCartResult(res.data);
    return res;
  }, [applyCartResult]);

  const clearCart = useCallback(async () => {
    const res = await cartService.clear();
    applyCartResult(res.data);
    return res;
  }, [applyCartResult]);

  return (
    <CartContext.Provider value={{ cartData, count, isLoading, refreshCart, addItem, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}