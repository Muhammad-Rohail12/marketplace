'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import Rating from '@/components/ui/Rating';
import PriceDisplay from './PriceDisplay';
import AddToCartButton from './AddToCartButton';
import WishlistButton from './WishlistButton';
import Spinner from '@/components/ui/Spinner';
import { resolveImageSrc, getImageFallback } from '@/utils/imageHelpers';
import { productService } from '@/services/productService';

export default function QuickViewModal({ product, isOpen, onClose }) {
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !product) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setDetail(null);
    productService.getPublic(product.slug)
      .then((res) => setDetail(res.data.product))
      .catch(() => setDetail(null))
      .finally(() => setIsLoading(false));
  }, [isOpen, product]);

  if (!product) return null;
  const primaryImage = product.media?.find((m) => m.isPrimary) || product.media?.[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick View" className="max-w-2xl">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-neutral-50 dark:bg-neutral-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primaryImage ? resolveImageSrc(primaryImage.url) : getImageFallback()}
            alt={primaryImage?.altText || product.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute right-2 top-2"><WishlistButton product={product} /></div>
        </div>

        <div className="flex flex-col gap-2">
          {product.brand && <span className="text-xs text-neutral-500">{product.brand.name}</span>}
          <h2 className="text-lg font-semibold">{product.name}</h2>
          {product.rating && <Rating value={product.rating.average} count={product.rating.count} />}
          <PriceDisplay pricing={product.pricing} size="lg" />

          {isLoading ? (
            <div className="flex items-center gap-2 py-4 text-sm text-neutral-500"><Spinner size={16} /> Loading details...</div>
          ) : (
            detail?.shortDescription && <p className="text-sm text-neutral-600 dark:text-neutral-400">{detail.shortDescription}</p>
          )}

          <div className="mt-2 flex flex-col gap-2">
            {product.productType === 'VARIABLE' ? (
              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Select Options
              </Link>
            ) : (
              <AddToCartButton productId={product.id} />
            )}
            <Link href={`/product/${product.slug}`} onClick={onClose} className="text-center text-sm font-medium text-primary-600 hover:underline">
              View full details →
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}