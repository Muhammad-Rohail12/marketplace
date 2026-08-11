'use client';

import { cn } from '@/utils/cn';

export default function Checkbox({ label, id, className = '', ...props }) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        id={id}
        className={cn(
          'h-4 w-4 rounded border-gray-300 text-primary-600 focus-visible:focus-ring',
          className
        )}
        {...props}
      />
      {label}
    </label>
  );
}
