'use client';

import { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Horizontal-scroll carousel primitive with arrow controls — no
// external carousel library, keeps bundle small. Used for homepage
// product rails (Phase 35) and category carousels (Phase 17/18's
// existing CategoryCarousel/BrandCarousel can migrate to this later).
export default function Carousel({ children, className = '' }) {
  const trackRef = useRef(null);

  const scrollBy = (amount) => trackRef.current?.scrollBy({ left: amount, behavior: 'smooth' });

  return (
    <div className={`group relative ${className}`}>
      <button
        type="button"
        onClick={() => scrollBy(-320)}
        aria-label="Scroll left"
        className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-elevated group-hover:md:flex dark:bg-neutral-800"
      >
        <FiChevronLeft />
      </button>
      <div ref={trackRef} className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth">
        {children}
      </div>
      <button
        type="button"
        onClick={() => scrollBy(320)}
        aria-label="Scroll right"
        className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-elevated group-hover:md:flex dark:bg-neutral-800"
      >
        <FiChevronRight />
      </button>
    </div>
  );
}