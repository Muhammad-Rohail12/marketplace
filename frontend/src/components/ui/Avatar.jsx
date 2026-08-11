import { cn } from '@/utils/cn';

export default function Avatar({ name = '', src, size = 40, className = '' }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={name || 'User avatar'}
        width={size}
        height={size}
        className={cn('rounded-full object-cover', className)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={name || 'User avatar'}
      style={{ width: size, height: size }}
      className={cn(
        'flex items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700',
        className
      )}
    >
      {initials || '?'}
    </div>
  );
}
