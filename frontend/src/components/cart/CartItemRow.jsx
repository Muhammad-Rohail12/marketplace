'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resolveImageSrc, getImageFallback } from '@/utils/imageHelpers';
import { formatMoney } from '@/utils/currencyFormat';
import QuantitySelector from './QuantitySelector';
import CartItemWarning from './CartItemWarning';
import { useCart } from '@/context/CartContext';

export default function CartItemRow({ item, currency }) {
  const { updateItem, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQty) => {
    setIsUpdating(true);
    try {
      await updateItem(item.id, newQty);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeItem(item.id);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex gap-3 border-b border-gray-100 py-4 dark:border-gray-800">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.image ? resolveImageSrc(item.image.url) : getImageFallback()}
        alt={item.image?.altText || item.product.name}
        className="h-20 w-20 rounded-md object-cover"
      />

      <div className="flex flex-1 flex-col gap-1">
        <Link href={`/product/${item.product.slug}`} className="text-sm font-medium hover:text-primary-600">
          {item.product.name}
        </Link>
        {item.variant && <p className="text-xs text-gray-500">{item.variant.name}</p>}

        <CartItemWarning message={item.warning} />

        <div className="mt-1 flex items-center justify-between gap-2">
          <QuantitySelector
            quantity={item.quantity}
            onChange={handleQuantityChange}
            max={item.availability.availableQuantity || 999}
            disabled={isUpdating || !item.availability.isAvailable}
          />
          <button type="button" onClick={handleRemove} disabled={isUpdating} className="text-xs text-danger-600 hover:underline">
            Remove
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between text-sm">
        <div className="text-right">
          <p className="font-semibold">{formatMoney(item.lineSubtotal, currency)}</p>
          {item.pricing.hasDiscount && (
            <p className="text-xs text-gray-400 line-through">{formatMoney(item.pricing.unitPrice * item.quantity, currency)}</p>
          )}
        </div>
      </div>
    </div>
  );
}