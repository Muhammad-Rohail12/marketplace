import { cn } from '@/utils/cn';

const VARIANTS = {
  neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  success: 'bg-success-500/10 text-success-600',
  danger: 'bg-danger-500/10 text-danger-600',
  warning: 'bg-warning-500/10 text-warning-600',
  primary: 'bg-primary-500/10 text-primary-600',
};

export default function Badge({ variant = 'neutral', className = '', children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
