'use client';

import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { cn } from '@/utils/cn';

export function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3 text-left text-sm font-medium focus-visible:focus-ring"
      >
        {title}
        <FiChevronDown className={cn('transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {open && <div className="pb-3 text-sm text-neutral-600 dark:text-neutral-400">{children}</div>}
    </div>
  );
}

export default function Accordion({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}