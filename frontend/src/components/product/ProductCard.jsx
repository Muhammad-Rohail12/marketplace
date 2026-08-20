'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resolveImageSrc, getImageFallback } from '@/utils/imageHelpers';
import PriceDisplay from './PriceDisplay';
import AddToCartButton from './AddToCartButton';
import WishlistButton from './WishlistButton';
import ProductBadgeStack from './ProductBadgeStack';
import QuickViewModal from './QuickViewModal';
import Rating from '@/components/ui/Rating';
import CountdownTimer from '@/components/deals/CountdownTimer';
import { FiEye } from 'react-icons/fi';
import { useModal } from '@/hooks/useModal';

export default function ProductCard({ product, variant = 'grid', showWishlist = true, showQuickView = true }) {
  const primaryImage = product.media?.find((m) => m.isPrimary) || product.media?.[0];
  const [imgError, setImgError] = useState(false);
  const quickView = useModal(false);

  const legacyPrice = product.variants?.[0]?.price;
  const pricing = product.pricing || (legacyPrice ? { hasPrice: true, effectivePrice: legacyPrice, currency: 'USD', hasDiscount: false } : { hasPrice: false });

  const isVariable = product.productType === 'VARIABLE';
  const isDeal = variant === 'deal';

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 transition-shadow hover:shadow-elevated dark:border-neutral-800">
        <div className="relative">
          <Link href={`/product/${product.slug}`} className="flex aspect-square items-center justify-center overflow-hidden bg-neutral-50 dark:bg-neutral-900">
            {primaryImage && !imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageSrc(primaryImage.url)}
                alt={primaryImage.altText || product.name}
                loading="lazy"
                onError={() => setImgError(true)}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getImageFallback()} alt="" className="h-2/3 w-2/3 opacity-30" />
            )}
          </Link>

          <div className="absolute left-2 top-2">
            <ProductBadgeStack product={{ ...product, pricing }} />
          </div>

          {showWishlist && (
            <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <WishlistButton product={{ ...product, pricing }} />
            </div>
          )}

          {showQuickView && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); quickView.open(); }}
              className="absolute bottom-2 left-1/2 flex -translate-x-1/2 translate-y-2 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-neutral-900 opacity-0 shadow-elevated transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-neutral-800 dark:text-white"
            >
              <FiEye size={13} /> Quick View
            </button>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-3">
          {product.brand && <span className="text-xs text-neutral-500">{product.brand.name}</span>}
          <Link href={`/product/${product.slug}`} className="line-clamp-2 text-sm font-medium hover:text-primary-600">
            {product.name}
          </Link>

          {product.rating && <Rating value={product.rating.average} count={product.rating.count} size={13} />}

          <PriceDisplay pricing={pricing} />

          {isDeal && product.dealEndAt && <CountdownTimer endAt={product.dealEndAt} compact />}

          <div className="mt-auto pt-1">
            {isVariable ? (
              <Link
                href={`/product/${product.slug}`}
                className="inline-flex w-full items-center justify-center rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Select Options
              </Link>
            ) : (
              <AddToCartButton productId={product.id} />
            )}
          </div>
        </div>
      </div>

      {showQuickView && <QuickViewModal product={product} isOpen={quickView.isOpen} onClose={quickView.close} />}
    </>
  );
}