import { cn } from '@/utils/cn';

export default function Spinner({ size = 24, className = '' }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{ width: size, height: size }}
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-primary-600 border-t-transparent',
        className
      )}
    />
  );
}
