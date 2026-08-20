'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu } from 'react-icons/fi';
import Drawer from '@/components/ui/Drawer';
import { cn } from '@/utils/cn';

function SidebarLinks({ links, pathname, onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              'rounded-md px-3 py-2 text-sm font-medium',
              isActive ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10' : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800'
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardLayout({ sidebarLinks, sidebarTitle, children }) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="container-page flex flex-col gap-4 py-6 lg:flex-row lg:gap-8">
      {/* Mobile: menu trigger + drawer */}
      <div className="flex items-center justify-between lg:hidden">
        <h2 className="text-sm font-semibold uppercase text-neutral-500">{sidebarTitle}</h2>
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          aria-label="Open menu"
          className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700"
        >
          <FiMenu size={16} /> Menu
        </button>
      </div>

      <Drawer isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} side="left" title={sidebarTitle}>
        <SidebarLinks links={sidebarLinks} pathname={pathname} onNavigate={() => setMobileSidebarOpen(false)} />
      </Drawer>

      {/* Desktop: fixed sidebar */}
      <aside className="hidden shrink-0 lg:block lg:w-56">
        <h2 className="mb-3 px-3 text-sm font-semibold uppercase text-neutral-500">{sidebarTitle}</h2>
        <SidebarLinks links={sidebarLinks} pathname={pathname} />
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}