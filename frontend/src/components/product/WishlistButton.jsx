'use client';

import { useEffect, useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import { cn } from '@/utils/cn';
import { wishlistService } from '@/services/wishlistService';
import { useToast } from '@/context/ToastContext';

export default function WishlistButton({ productId, product, size = 16, className = '' }) {
  const { showToast } = useToast();
  const resolvedId = product?.id ?? productId;
  const [active, setActive] = useState(false);

  useEffect(() => {
    let mounted = true;
    wishlistService.list().then((response) => {
      if (mounted) setActive((response.data.items || []).some((item) => item.productId === resolvedId));
    }).catch(() => {});
    return () => { mounted = false; };
  }, [resolvedId]);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (active) await wishlistService.remove(resolvedId);
      else await wishlistService.add(resolvedId);
      setActive(!active);
      showToast(!active ? 'Saved to your wishlist' : 'Removed from your wishlist', 'success', 2000);
    } catch (error) {
      showToast(error.message || 'Sign in to manage your wishlist', 'error', 2500);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? 'Remove from wishlist' : 'Save to wishlist'}
      aria-pressed={active}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-xs transition-colors hover:bg-white dark:bg-neutral-900/90 dark:hover:bg-neutral-900',
        className
      )}
    >
      <FiHeart size={size} className={cn(active ? 'fill-danger-500 text-danger-500' : 'text-neutral-500')} />
    </button>
  );
}