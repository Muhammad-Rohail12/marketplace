'use client';

import { useRef, useState } from 'react';
import { resolveImageSrc } from '@/utils/imageHelpers';

// Cursor-follow magnifier: a fixed-size lens shows a zoomed crop of
// the same source image, positioned to track the pointer. Disabled
// on touch devices (no meaningful hover) — those use the lightbox
// (ImageZoomViewer) instead, per spec's mobile-appropriate guidance.
export default function ImageMagnifier({ src, alt, zoom = 2.2 }) {
  const containerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 });

  const LENS_SIZE = 160;

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clampedX = Math.max(LENS_SIZE / 2, Math.min(x, rect.width - LENS_SIZE / 2));
    const clampedY = Math.max(LENS_SIZE / 2, Math.min(y, rect.height - LENS_SIZE / 2));

    setLensPos({ x: clampedX - LENS_SIZE / 2, y: clampedY - LENS_SIZE / 2 });

    const bgX = -(x * zoom - LENS_SIZE / 2);
    const bgY = -(y * zoom - LENS_SIZE / 2);
    setBgPos({ x: bgX, y: bgY });
  };

  return (
    <div
      ref={containerRef}
      className="relative hidden aspect-square w-full overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900 md:block"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={resolveImageSrc(src)} alt={alt} className="h-full w-full object-contain" />

      {isHovering && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full border-2 border-white shadow-lg"
          style={{
            width: LENS_SIZE,
            height: LENS_SIZE,
            left: lensPos.x,
            top: lensPos.y,
            backgroundImage: `url(${resolveImageSrc(src)})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${zoom * 100}%`,
            backgroundPosition: `${bgPos.x}px ${bgPos.y}px`,
          }}
        />
      )}
    </div>
  );
}