'use client';

import { cn } from '@/utils/cn';

const VARIANTS = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700',
  secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
  outline: 'border border-current bg-transparent text-primary-600 hover:bg-primary-50',
  ghost: 'bg-transparent text-primary-600 hover:bg-primary-50',
  danger: 'bg-danger-500 text-white hover:bg-danger-600',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  children,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
        'focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-60',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {isLoading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
