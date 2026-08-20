'use client';

import { cn } from '@/utils/cn';

const VARIANTS = {
  primary: 'bg-primary-600 text-white shadow-xs hover:bg-primary-700 active:bg-primary-800',
  secondary: 'bg-secondary-500 text-white shadow-xs hover:bg-secondary-600 active:bg-secondary-700',
  accent: 'bg-accent-500 text-white shadow-xs hover:bg-accent-600',
  outline: 'border border-neutral-300 bg-transparent text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800',
  ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800',
  danger: 'bg-danger-500 text-white shadow-xs hover:bg-danger-600',
  link: 'bg-transparent text-primary-600 underline-offset-4 hover:underline p-0 h-auto',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-md',
  md: 'px-4 py-2 text-sm rounded-md',
  lg: 'px-5 py-2.5 text-base rounded-lg',
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
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 active:scale-[0.98]',
        'focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        VARIANTS[variant],
        variant !== 'link' && SIZES[size],
        className
      )}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}