import { FiStar } from 'react-icons/fi';
import { cn } from '@/utils/cn';

export default function Rating({ value = 0, count, size = 16, showCount = true, className = '' }) {
  const rounded = Math.round(value * 2) / 2;

  return (
    <div className={cn('flex items-center gap-1', className)} role="img" aria-label={`Rated ${value} out of 5${count ? ` from ${count} reviews` : ''}`}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= rounded;
          const half = !filled && i + 0.5 === rounded;
          return (
            <FiStar
              key={i}
              size={size}
              className={cn(filled || half ? 'fill-warning-500 text-warning-500' : 'text-neutral-300 dark:text-neutral-700')}
            />
          );
        })}
      </div>
      {showCount && count !== undefined && <span className="text-xs text-neutral-500">({count.toLocaleString()})</span>}
    </div>
  );
}