import { cn } from '@/utils/cn';

export default function Skeleton({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={cn('skeleton-shimmer animate-shimmer rounded-md bg-neutral-200 dark:bg-neutral-800', className)}
    />
  );
}