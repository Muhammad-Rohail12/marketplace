import { cn } from '@/utils/cn';

export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-4 shadow-card dark:border-gray-800 dark:bg-gray-900',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
