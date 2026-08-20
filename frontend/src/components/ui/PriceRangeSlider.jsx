'use client';

import { useState, useEffect } from 'react';
import { formatMoney } from '@/utils/currencyFormat';

// Dual native <input type="range"> overlay — no external slider
// library needed, keeps bundle small (consistent with Phase 31's
// no-library Carousel approach). Bounds are derived from the
// currently-visible product set (documented client-side limitation,
// same as Phase 38's brand-filter derivation) since no server-side
// price-range aggregation endpoint exists yet.
export default function PriceRangeSlider({ min = 0, max = 1000, value, onChange }) {
  const [localMin, setLocalMin] = useState(value?.[0] ?? min);
  const [localMax, setLocalMax] = useState(value?.[1] ?? max);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalMin(value?.[0] ?? min);
    setLocalMax(value?.[1] ?? max);
  }, [value, min, max]);

  const commit = (nextMin, nextMax) => onChange([nextMin, nextMax]);

  const handleMinChange = (e) => {
    const v = Math.min(Number(e.target.value), localMax - 1);
    setLocalMin(v);
  };
  const handleMaxChange = (e) => {
    const v = Math.max(Number(e.target.value), localMin + 1);
    setLocalMax(v);
  };

  if (min >= max) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700">
        <div
          className="absolute h-1.5 rounded-full bg-primary-500"
          style={{
            left: `${((localMin - min) / (max - min)) * 100}%`,
            right: `${100 - ((localMax - min) / (max - min)) * 100}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localMin}
          onChange={handleMinChange}
          onMouseUp={() => commit(localMin, localMax)}
          onTouchEnd={() => commit(localMin, localMax)}
          className="range-thumb pointer-events-none absolute inset-0 h-1.5 w-full appearance-none bg-transparent"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localMax}
          onChange={handleMaxChange}
          onMouseUp={() => commit(localMin, localMax)}
          onTouchEnd={() => commit(localMin, localMax)}
          className="range-thumb pointer-events-none absolute inset-0 h-1.5 w-full appearance-none bg-transparent"
          aria-label="Maximum price"
        />
      </div>
      <div className="flex justify-between text-xs text-neutral-500">
        <span>{formatMoney(localMin, 'USD')}</span>
        <span>{formatMoney(localMax, 'USD')}</span>
      </div>
    </div>
  );
}