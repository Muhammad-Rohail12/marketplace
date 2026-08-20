'use client';

import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { useEffect } from 'react';

export default function ReviewImageLightbox({ images, activeIndex, onClose, onNavigate }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate(Math.max(0, activeIndex - 1));
      if (e.key === 'ArrowRight') onNavigate(Math.min(images.length - 1, activeIndex + 1));
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [activeIndex, images.length, onClose, onNavigate]);

  if (activeIndex === null) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Customer photo viewer" className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
      <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
        <FiX size={22} />
      </button>
      {activeIndex > 0 && (
        <button type="button" onClick={(e) => { e.stopPropagation(); onNavigate(activeIndex - 1); }} aria-label="Previous photo" className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
          <FiChevronLeft size={26} />
        </button>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[activeIndex]} alt="Customer photo" onClick={(e) => e.stopPropagation()} className="max-h-[85vh] max-w-[85vw] rounded object-contain" />
      {activeIndex < images.length - 1 && (
        <button type="button" onClick={(e) => { e.stopPropagation(); onNavigate(activeIndex + 1); }} aria-label="Next photo" className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
          <FiChevronRight size={26} />
        </button>
      )}
    </div>
  );
}