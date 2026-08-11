'use client';

import { cn } from '@/utils/cn';

export default function Input({ label, id, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          'rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-transparent',
          'focus-visible:focus-ring',
          error && 'border-danger-500',
          className
        )}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-danger-500">
          {error}
        </p>
      )}
    </div>
  );
}
