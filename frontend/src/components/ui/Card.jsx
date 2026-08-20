import { cn } from '@/utils/cn';

export default function Card({ className = '', interactive = false, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900',
        interactive && 'transition-shadow duration-200 hover:shadow-elevated',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}