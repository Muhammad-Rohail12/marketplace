'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AccountLayout from '@/components/account/AccountLayout';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/feedback/EmptyState';
import { resolveImageSrc, getImageFallback } from '@/utils/imageHelpers';
import { formatMoney } from '@/utils/currencyFormat';
import { wishlistService } from '@/services/wishlistService';
import { useCart } from '@/context/CartContext';

function WishlistContent() {
  const { addItem } = useCart();
  const [items, setItems] = useState([]);
  const [movingId, setMovingId] = useState(null);

  useEffect(() => {
    let mounted = true;
    wishlistService.list().then((response) => {
      if (!mounted) return;
      setItems((response.data.items || []).map(({ product }) => ({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        imageUrl: product.media?.[0]?.url || null,
        price: product.pricing?.[0]?.basePrice ?? null,
        currency: product.pricing?.[0]?.currency || 'USD',
      })));
    }).catch(() => { if (mounted) setItems([]); });
    return () => { mounted = false; };
  }, []);

  const handleRemove = (productId) => {
    wishlistService.remove(productId).then(() => setItems((current) => current.filter((item) => item.productId !== productId)));
  };

  const handleAddToCart = async (item) => {
    setMovingId(item.productId);
    try {
      await addItem({ productId: item.productId, quantity: 1 });
    } finally {
      setMovingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Wishlist</h1>
        <p className="text-sm text-neutral-500">{items.length} saved item{items.length === 1 ? '' : 's'}</p>
      </div>

      {items.length === 0 ? (
        <EmptyState title="Your wishlist is empty" message="Tap the heart icon on any product to save it here." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.productId} className="flex flex-col gap-2 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
              <Link href={item.slug ? `/product/${item.slug}` : '#'}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl ? resolveImageSrc(item.imageUrl) : getImageFallback()} alt={item.name || ''} className="aspect-square w-full rounded-md object-cover" />
              </Link>
              <p className="line-clamp-2 text-sm font-medium">{item.name || 'Product'}</p>
              {item.price !== null && <p className="text-sm font-semibold">{formatMoney(item.price, item.currency)}</p>}
              <div className="mt-1 flex flex-col gap-1">
                <Button size="sm" onClick={() => handleAddToCart(item)} isLoading={movingId === item.productId}>Add to Cart</Button>
                <Button size="sm" variant="ghost" onClick={() => handleRemove(item.productId)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function WishlistPage() {
  return (
    <AccountLayout>
      <ProtectedRoute>
        <WishlistContent />
      </ProtectedRoute>
    </AccountLayout>
  );
}