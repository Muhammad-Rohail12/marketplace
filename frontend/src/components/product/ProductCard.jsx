'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resolveImageSrc, getImageFallback } from '@/utils/imageHelpers';
import PriceDisplay from './PriceDisplay';
import AddToCartButton from './AddToCartButton';

export default function ProductCard({ product }) {
  const primaryImage = product.media?.find((m) => m.isPrimary) || product.media?.[0];
  const [imgError, setImgError] = useState(false);

  const legacyPrice = product.variants?.[0]?.price;
  const pricing = product.pricing || (legacyPrice ? { hasPrice: true, effectivePrice: legacyPrice, currency: 'USD', hasDiscount: false } : { hasPrice: false });

  const isVariable = product.productType === 'VARIABLE';

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-card dark:border-gray-800">
      <Link href={`/product/${product.slug}`} className="flex aspect-square items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900">
        {primaryImage && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolveImageSrc(primaryImage.url)}
            alt={primaryImage.altText || product.name}
            width={primaryImage.width || 300}
            height={primaryImage.height || 300}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={getImageFallback()} alt="" className="h-2/3 w-2/3 opacity-30" />
        )}
      </Link>
      <div className="flex flex-col gap-1 p-3">
        {product.brand && <span className="text-xs text-gray-500">{product.brand.name}</span>}
        <Link href={`/product/${product.slug}`} className="line-clamp-2 text-sm font-medium hover:text-primary-600">
          {product.name}
        </Link>
        <span className="text-xs text-gray-400">★★★★★ (placeholder)</span>
        <PriceDisplay pricing={pricing} />

        {isVariable ? (
          <Link
            href={`/product/${product.slug}`}
            className="mt-1 inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Select Options
          </Link>
        ) : (
          <div className="mt-1">
            <AddToCartButton productId={product.id} />
          </div>
        )}
      </div>
    </div>
  );
}