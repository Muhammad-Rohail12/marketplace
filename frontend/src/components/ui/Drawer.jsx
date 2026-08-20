'use client';

import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { cn } from '@/utils/cn';

// Mobile nav / filter-panel primitive — slides from a given side.
// Used by Phase 32 (mobile nav), Phase 39 (mobile filters), etc.
export default function Drawer({ isOpen, onClose, side = 'left', title, children, className = '' }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sideClasses = {
    left: 'left-0 animate-slide-in-right [animation-direction:reverse]',
    right: 'right-0 animate-slide-in-right',
    bottom: 'bottom-0 left-0 w-full animate-slide-up',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 animate-fade-in" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'fixed top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-4 shadow-modal dark:bg-neutral-900',
          side === 'bottom' && 'h-auto max-h-[85vh] w-full max-w-none rounded-t-xl',
          sideClasses[side],
          className
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="text-base font-semibold">{title}</h2>}
          <button type="button" onClick={onClose} aria-label="Close" className="ml-auto rounded-md p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <FiX size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}