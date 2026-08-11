'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';

export default function Modal({ isOpen, onClose, title, children, className = '' }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', handleKeyDown);
    dialogRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'w-full max-w-md rounded-lg bg-white p-6 shadow-dropdown dark:bg-gray-900',
          'focus-visible:focus-ring',
          className
        )}
      >
        {title && (
          <h2 id="modal-title" className="mb-4 text-lg font-semibold">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
