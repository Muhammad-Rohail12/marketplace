'use client';

import { useEffect, useRef, useState } from 'react';
import { resolveImageSrc, getImageFallback } from '@/utils/imageHelpers';
import PriceDisplay from './PriceDisplay';
import AddToCartButton from './AddToCartButton';

export default function StickyPurchaseBar({ product, media, pricing, selectedVariantId, isOutOfStock, requiresVariant }) {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = document.getElementById('purchase-card-sentinel');
    if (!sentinel) return undefined;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const image = media?.find((m) => m.isPrimary) || media?.[0];

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 p-3 shadow-modal backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
      <div className="container-page flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image ? resolveImageSrc(image.url) : getImageFallback()} alt="" className="hidden h-10 w-10 rounded object-cover sm:block" />
        <p className="hidden flex-1 truncate text-sm font-medium sm:block">{product.name}</p>
        <PriceDisplay pricing={pricing} />
        <div className="ml-auto w-40">
          <AddToCartButton
            productId={product.id}
            variantId={selectedVariantId}
            requiresVariant={requiresVariant}
            disabled={isOutOfStock}
          />
        </div>
      </div>
    </div>
  );
}