'use client';

import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import { cn } from '@/utils/cn';

const ICONS = { success: FiCheckCircle, error: FiAlertCircle, info: FiInfo };
const STYLES = {
  success: 'border-success-500/30 bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
  error: 'border-danger-500/30 bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-400',
  info: 'border-primary-500/30 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400',
};

export default function Toast({ id, type = 'info', message, onDismiss }) {
  const Icon = ICONS[type] || ICONS.info;
  return (
    <div
      role="status"
      className={cn('flex w-80 items-start gap-2 rounded-lg border px-4 py-3 shadow-elevated animate-toast-in', STYLES[type])}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p className="flex-1 text-sm">{message}</p>
      <button type="button" onClick={() => onDismiss(id)} aria-label="Dismiss" className="text-current opacity-60 hover:opacity-100">
        <FiX size={16} />
      </button>
    </div>
  );
}