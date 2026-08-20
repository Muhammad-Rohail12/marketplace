import { cn } from '@/utils/cn';

const VARIANTS = {
  neutral: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  success: 'bg-success-50 text-success-600 dark:bg-success-500/10',
  danger: 'bg-danger-50 text-danger-600 dark:bg-danger-500/10',
  warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/10',
  primary: 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400',
};

export default function Badge({ variant = 'neutral', className = '', children }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', VARIANTS[variant], className)}>
      {children}
    </span>
  );
}