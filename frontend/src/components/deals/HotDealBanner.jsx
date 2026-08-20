'use client';

import Link from 'next/link';
import { resolveImageSrc, getImageFallback } from '@/utils/imageHelpers';
import CountdownTimer from './CountdownTimer';
import DealBadge from './DealBadge';

// Highlights the single deal with the largest real discount
// percentage from the fetched set — never a fabricated "featured deal."
export default function HotDealBanner({ product }) {
  if (!product) return null;
  const image = product.media?.[0];

  return (
    <div className="flex flex-col items-center gap-6 overflow-hidden rounded-xl bg-gradient-to-r from-danger-600 to-secondary-600 p-6 text-white sm:flex-row sm:p-10">
      <div className="flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image ? resolveImageSrc(image.url) : getImageFallback()} alt={product.name} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-2 text-center sm:text-left">
        <span className="inline-flex w-fit self-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold sm:self-start">Deal of the Day</span>
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <div className="flex items-center justify-center gap-2 sm:justify-start">
          <DealBadge percentage={product.pricing?.discountPercentage} />
          <span className="text-lg font-semibold">${product.pricing?.effectivePrice?.toFixed(2)}</span>
          {product.pricing?.compareAtPrice && (
            <span className="text-sm text-white/70 line-through">${product.pricing.compareAtPrice.toFixed(2)}</span>
          )}
        </div>
        {product.dealEndAt && (
          <div className="mt-2 flex justify-center sm:justify-start">
            <CountdownTimer endAt={product.dealEndAt} />
          </div>
        )}
        <Link
          href={`/product/${product.slug}`}
          className="mt-2 inline-flex w-fit items-center justify-center self-center rounded-md bg-white px-5 py-2 text-sm font-semibold text-neutral-900 hover:scale-[1.02] sm:self-start"
        >
          Shop This Deal
        </Link>
      </div>
    </div>
  );
}