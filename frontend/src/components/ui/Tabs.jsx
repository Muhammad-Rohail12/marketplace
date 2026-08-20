'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';

// Generalizes the ad-hoc "button row + activeTab state" pattern used
// repeatedly since Phase 19 (PIM admin), Phase 21 (store), Phase 22
// (product edit) — future phases should use this instead of
// re-implementing the same tab-bar markup.
export default function Tabs({ tabs, defaultTab, onChange, className = '' }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.value);

  const handleSelect = (value) => {
    setActive(value);
    onChange?.(value);
  };

  const activeTab = tabs.find((t) => t.value === active);

  return (
    <div className={className}>
      <div role="tablist" className="flex flex-wrap gap-1 border-b border-neutral-200 dark:border-neutral-800">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active === tab.value}
            onClick={() => handleSelect(tab.value)}
            className={cn(
              'px-3 py-2 text-sm font-medium transition-colors focus-visible:focus-ring',
              active === tab.value ? 'border-b-2 border-primary-600 text-primary-600' : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab?.content && <div className="pt-4">{activeTab.content}</div>}
    </div>
  );
}