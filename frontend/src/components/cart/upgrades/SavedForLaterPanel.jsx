'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { resolveImageSrc, getImageFallback } from '@/utils/imageHelpers';
import { formatMoney } from '@/utils/currencyFormat';
import { getSavedItems, removeSavedItem } from '@/utils/savedForLater';
import { useCart } from '@/context/CartContext';

export default function SavedForLaterPanel() {
  const { addItem } = useCart();
  const [saved, setSaved] = useState([]);
  const [movingId, setMovingId] = useState(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setSaved(getSavedItems()); }, []);

  if (saved.length === 0) return null;

  const handleMoveToCart = async (item) => {
    setMovingId(`${item.productId}-${item.variantId}`);
    try {
      await addItem({ productId: item.productId, variantId: item.variantId, quantity: 1 });
      removeSavedItem(item.productId, item.variantId);
      setSaved(getSavedItems());
    } finally {
      setMovingId(null);
    }
  };

  const handleRemove = (item) => {
    removeSavedItem(item.productId, item.variantId);
    setSaved(getSavedItems());
  };

  return (
    <div className="flex flex-col gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
      <h2 className="text-sm font-semibold uppercase text-neutral-500">Saved for Later ({saved.length})</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {saved.map((item) => {
          const key = `${item.productId}-${item.variantId}`;
          return (
            <div key={key} className="flex flex-col gap-1 rounded-lg border border-neutral-200 p-2 dark:border-neutral-800">
              <Link href={`/product/${item.slug}`} className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl ? resolveImageSrc(item.imageUrl) : getImageFallback()} alt={item.name} className="aspect-square w-full rounded-md object-cover" />
              </Link>
              <p className="line-clamp-2 text-xs font-medium">{item.name}</p>
              {item.price !== null && <p className="text-xs font-semibold">{formatMoney(item.price, item.currency || 'USD')}</p>}
              <div className="mt-1 flex flex-col gap-1">
                <Button size="sm" onClick={() => handleMoveToCart(item)} isLoading={movingId === key}>Move to Cart</Button>
                <Button size="sm" variant="ghost" onClick={() => handleRemove(item)}>Remove</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}