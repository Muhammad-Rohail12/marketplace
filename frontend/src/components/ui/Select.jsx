'use client';

import { cn } from '@/utils/cn';

export default function Select({ label, id, error, options = [], className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        id={id}
        aria-invalid={!!error}
        className={cn(
          'rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-transparent',
          'focus-visible:focus-ring',
          error && 'border-danger-500',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-danger-500">{error}</p>}
    </div>
  );
}
