'use client';

import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

export default function StarRatingInput({ value, onChange }) {
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = hoverValue || value;

  return (
    <div role="radiogroup" aria-label="Rate this product" className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
          onClick={() => onChange(star)}
          className="p-0.5 focus-visible:focus-ring"
        >
          <FiStar size={28} className={star <= displayValue ? 'fill-warning-500 text-warning-500' : 'text-neutral-300 dark:text-neutral-700'} />
        </button>
      ))}
    </div>
  );
}