'use client';

import { resolveImageSrc } from '@/utils/imageHelpers';
import ImageMagnifier from './ImageMagnifier';

export default function ProductMainImage({ media, onOpenZoom }) {
  if (!media) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400 dark:border-gray-700 dark:bg-gray-900">
        No image available
      </div>
    );
  }

  return (
    <div>
      {/* Desktop: hover magnifier. All viewports: click opens lightbox */}
      <button
        type="button"
        onClick={onOpenZoom}
        aria-label="Open full-size image viewer"
        className="block w-full focus-visible:focus-ring md:hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolveImageSrc(media.url)}
          alt={media.altText || ''}
          width={media.width || 600}
          height={media.height || 600}
          className="aspect-square w-full rounded-lg object-contain"
        />
      </button>

      <div className="hidden md:block" onClick={onOpenZoom} role="presentation">
        <ImageMagnifier src={media.url} alt={media.altText || ''} />
      </div>
    </div>
  );
}