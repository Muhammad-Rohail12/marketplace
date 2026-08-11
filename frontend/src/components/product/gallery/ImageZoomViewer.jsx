'use client';

import { useEffect, useCallback } from 'react';
import { resolveImageSrc } from '@/utils/imageHelpers';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Lightbox with prev/next, Escape-to-close, and touch-friendly
// large-tap-target controls — used on click (desktop) and as the
// primary interaction on mobile where hover-magnify isn't available.
export default function ImageZoomViewer({ media, activeIndex, onClose, onNavigate }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate(Math.max(0, activeIndex - 1));
      if (e.key === 'ArrowRight') onNavigate(Math.min(media.length - 1, activeIndex + 1));
    },
    [activeIndex, media.length, onClose, onNavigate]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (activeIndex === null || !media[activeIndex]) return null;
  const current = media[activeIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Product image viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image viewer"
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus-visible:focus-ring"
      >
        <FiX size={24} />
      </button>

      {activeIndex > 0 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNavigate(activeIndex - 1); }}
          aria-label="Previous image"
          className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus-visible:focus-ring"
        >
          <FiChevronLeft size={28} />
        </button>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolveImageSrc(current.url)}
        alt={current.altText || ''}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[90vw] object-contain"
      />

      {activeIndex < media.length - 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNavigate(activeIndex + 1); }}
          aria-label="Next image"
          className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus-visible:focus-ring"
        >
          <FiChevronRight size={28} />
        </button>
      )}
    </div>
  );
}