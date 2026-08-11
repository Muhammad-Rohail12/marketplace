'use client';

import { cn } from '@/utils/cn';

export default function ColorSwatchSelector({ values = [], selectedId, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((v) => (
        <button
          key={v.id}
          type="button"
          onClick={() => onSelect?.(v)}
          title={v.label}
          style={{ backgroundColor: v.colorHex || '#ccc' }}
          className={cn(
            'h-8 w-8 rounded-full border-2',
            selectedId === v.id ? 'border-primary-600' : 'border-gray-200 dark:border-gray-700'
          )}
        />
      ))}
    </div>
  );
}