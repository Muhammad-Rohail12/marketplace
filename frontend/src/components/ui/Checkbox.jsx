'use client';

import { cn } from '@/utils/cn';

export default function Checkbox({ id, label, checked, onChange, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="flex min-h-[44px] cursor-pointer items-center gap-2 py-1 text-sm sm:min-h-0 sm:py-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 shrink-0 rounded border-neutral-300 text-primary-600 focus-visible:focus-ring dark:border-neutral-700"
          {...props}
        />
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
    </div>
  );
}
