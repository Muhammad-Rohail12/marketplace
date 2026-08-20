import { FiCheck } from 'react-icons/fi';
import { cn } from '@/utils/cn';

const STEPS = [
  { key: 'review', label: 'Review Order' },
  { key: 'payment', label: 'Payment' },
  { key: 'confirm', label: 'Place Order' },
];

export default function CheckoutSteps({ currentStep }) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;
        return (
          <li key={step.key} className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                isDone && 'bg-success-500 text-white',
                isActive && 'bg-primary-600 text-white',
                !isDone && !isActive && 'bg-neutral-200 text-neutral-500 dark:bg-neutral-800'
              )}
            >
              {isDone ? <FiCheck size={14} /> : i + 1}
            </span>
            <span className={cn('hidden text-sm sm:block', isActive ? 'font-semibold' : 'text-neutral-500')}>{step.label}</span>
            {i < STEPS.length - 1 && <span className="mx-1 h-px w-6 bg-neutral-200 dark:bg-neutral-800 sm:w-10" />}
          </li>
        );
      })}
    </ol>
  );
}