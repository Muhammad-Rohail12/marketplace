'use client';

import { useState } from 'react';
import ReviewImageLightbox from './ReviewImageLightbox';

export default function CustomerPhotosStrip({ reviews }) {
  const allImages = reviews.flatMap((r) => r.images || []);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (allImages.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">Customer Photos</h3>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {allImages.slice(0, 10).map((img, i) => (
          <button key={i} type="button" onClick={() => setLightboxIndex(i)} className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={`Customer photo ${i + 1}`} className="h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
          </button>
        ))}
      </div>
      {lightboxIndex !== null && (
        <ReviewImageLightbox images={allImages} activeIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
      )}
    </div>
  );
}