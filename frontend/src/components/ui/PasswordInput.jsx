'use client';

import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { cn } from '@/utils/cn';

export default function PasswordInput({ label, id, error, className = '', ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            'w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm dark:border-gray-700 dark:bg-transparent',
            'focus-visible:focus-ring',
            error && 'border-danger-500',
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
        >
          {visible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-danger-500">
          {error}
        </p>
      )}
    </div>
  );
}
