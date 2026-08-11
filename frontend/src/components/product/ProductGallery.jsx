'use client';

import { useState, useMemo } from 'react';
import ProductMainImage from './ProductMainImage';
import ProductThumbnailList from './ProductThumbnailList';
import ImageZoomViewer from './ImageZoomViewer';

// Filters to the selected variant's images when one is chosen,
// falling back to the full product gallery otherwise — supports the
// Phase 23 variant-image-switching requirement without needing full
// purchasing logic wired in yet.
export default function ProductGallery({ media = [], selectedVariantId = null }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const displayMedia = useMemo(() => {
    if (!selectedVariantId) return media;
    const variantMedia = media.filter((m) => m.variantId === selectedVariantId);
    return variantMedia.length > 0 ? variantMedia : media;
  }, [media, selectedVariantId]);

  const safeIndex = Math.min(activeIndex, Math.max(0, displayMedia.length - 1));

  if (!displayMedia.length) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400 dark:border-gray-700 dark:bg-gray-900">
        No images yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <div className="order-2 md:order-1">
        <ProductThumbnailList media={displayMedia} activeIndex={safeIndex} onSelect={setActiveIndex} orientation="horizontal" />
      </div>

      <div className="order-1 flex-1 md:order-2">
        <ProductMainImage media={displayMedia[safeIndex]} onOpenZoom={() => setZoomOpen(true)} />
      </div>

      {zoomOpen && (
        <ImageZoomViewer
          media={displayMedia}
          activeIndex={safeIndex}
          onClose={() => setZoomOpen(false)}
          onNavigate={setActiveIndex}
        />
      )}
    </div>
  );
}