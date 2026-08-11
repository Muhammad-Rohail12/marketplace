'use client';

import { cn } from '@/utils/cn';

export default function SizeSelector({ values = [], selectedId, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((v) => (
        <button
          key={v.id}
          type="button"
          onClick={() => onSelect?.(v)}
          className={cn(
            'rounded-md border px-3 py-1.5 text-sm',
            selectedId === v.id
              ? 'border-primary-600 bg-primary-50 text-primary-700'
              : 'border-gray-300 dark:border-gray-700'
          )}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}