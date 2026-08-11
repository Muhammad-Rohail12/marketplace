'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';

export default function AddToCartButton({ productId, variantId = null, quantity = 1, requiresVariant = false, disabled = false }) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [state, setState] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  const handleClick = async () => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }

    if (requiresVariant && !variantId) {
      setError('Please select an option first');
      setState('error');
      return;
    }

    setState('loading');
    setError('');
    try {
      await addItem({ productId, variantId, quantity });
      setState('success');
      setTimeout(() => setState('idle'), 1500);
    } catch (err) {
      setError(err.message || 'Could not add to cart');
      setState('error');
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Button type="button" onClick={handleClick} disabled={disabled || state === 'loading'} isLoading={state === 'loading'}>
        {state === 'success' ? '✓ Added to Cart' : 'Add to Cart'}
      </Button>
      {state === 'error' && error && <p className="text-xs text-danger-600">{error}</p>}
    </div>
  );
}