'use client';

import Link from 'next/link';
import { resolveImageSrc, getImageFallback } from '@/utils/imageHelpers';
import { formatMoney } from '@/utils/currencyFormat';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';

export default function MiniCart({ onClose }) {
  const { cartData, isLoading } = useCart();
  const items = cartData?.sellerGroups.flatMap((g) => g.items) || [];

  return (
    <div className="absolute right-0 top-full z-40 mt-2 w-80 rounded-lg border border-neutral-200 bg-white p-4 shadow-dropdown dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="mb-2 text-sm font-semibold">Your Cart</h3>

      {isLoading ? (
        <p className="text-sm text-neutral-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-neutral-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="flex max-h-72 flex-col gap-3 overflow-y-auto">
            {items.slice(0, 5).map((item) => (
              <div key={item.id} className="flex gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image ? resolveImageSrc(item.image.url) : getImageFallback()}
                  alt=""
                  className="h-12 w-12 rounded object-cover"
                />
                <div className="flex-1 text-xs">
                  <p className="line-clamp-1 font-medium">{item.product.name}</p>
                  {item.variant && <p className="text-neutral-500">{item.variant.name}</p>}
                  <p className="text-neutral-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-xs font-semibold">{formatMoney(item.lineSubtotal, cartData.summary.currency)}</p>
              </div>
            ))}
          </div>

          {items.length > 5 && <p className="mt-2 text-center text-xs text-neutral-400">+{items.length - 5} more item(s)</p>}

          <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-2 text-sm font-semibold dark:border-neutral-800">
            <span>Subtotal</span>
            <span>{formatMoney(cartData.summary.cartSubtotal, cartData.summary.currency)}</span>
          </div>

          <div className="mt-3 flex flex-col gap-2">
            <Link href="/cart" onClick={onClose}>
              <Button variant="outline" className="w-full">View Cart</Button>
            </Link>
            <Button disabled title="Coming in a future phase" className="w-full">Checkout</Button>
          </div>
        </>
      )}
    </div>
  );
}