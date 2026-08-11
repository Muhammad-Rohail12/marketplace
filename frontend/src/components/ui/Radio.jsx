'use client';

import { cn } from '@/utils/cn';

export default function Radio({ label, id, className = '', ...props }) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm">
      <input
        type="radio"
        id={id}
        className={cn(
          'h-4 w-4 border-gray-300 text-primary-600 focus-visible:focus-ring',
          className
        )}
        {...props}
      />
      {label}
    </label>
  );
}
