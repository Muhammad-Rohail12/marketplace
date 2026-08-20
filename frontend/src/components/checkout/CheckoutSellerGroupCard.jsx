import Link from 'next/link';
import { resolveImageSrc, getImageFallback } from '@/utils/imageHelpers';
import { formatMoney } from '@/utils/currencyFormat';

export default function CheckoutSellerGroupCard({ group, currency }) {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800">
      <div className="border-b border-neutral-100 px-4 py-2 text-sm font-semibold dark:border-neutral-900">
        {group.store.name}
      </div>
      <div className="flex flex-col gap-3 p-4">
        {group.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image ? resolveImageSrc(item.image.url) : getImageFallback()} alt="" className="h-14 w-14 rounded-md object-cover" />
            <div className="flex-1 text-sm">
              <Link href={`/product/${item.product.slug}`} className="font-medium hover:text-primary-600">{item.product.name}</Link>
              {item.variant && <p className="text-xs text-neutral-500">{item.variant.name}</p>}
              <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-semibold">{formatMoney(item.lineSubtotal, currency)}</p>
          </div>
        ))}
        <div className="flex justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-500 dark:border-neutral-900">
          <span>Shipping — {group.shipping.selected.name} ({group.shipping.selected.minDays}–{group.shipping.selected.maxDays} business days)</span>
          <span>{group.shipping.selected.price === 0 ? 'FREE' : formatMoney(group.shipping.selected.price, currency)}</span>
        </div>
      </div>
    </div>
  );
}