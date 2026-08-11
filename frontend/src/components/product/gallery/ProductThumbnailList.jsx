'use client';

import { resolveImageSrc } from '@/utils/imageHelpers';
import { cn } from '@/utils/cn';

export default function ProductThumbnailList({ media = [], activeIndex, onSelect, orientation = 'vertical' }) {
  if (!media.length) return null;

  return (
    <div
      role="listbox"
      aria-label="Product image thumbnails"
      className={cn('flex gap-2', orientation === 'vertical' ? 'flex-col' : 'flex-row overflow-x-auto')}
    >
      {media.map((m, i) => (
        <button
          key={m.id}
          type="button"
          role="option"
          aria-selected={activeIndex === i}
          onClick={() => onSelect(i)}
          className={cn(
            'h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 focus-visible:focus-ring',
            activeIndex === i ? 'border-primary-600' : 'border-transparent hover:border-gray-300'
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveImageSrc(m.url)}
            alt={m.altText || ''}
            width={64}
            height={64}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </button>
      ))}
    </div>
  );
}