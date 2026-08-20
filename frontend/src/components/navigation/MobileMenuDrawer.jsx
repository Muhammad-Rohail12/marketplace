'use client';

import Link from 'next/link';
import Drawer from '@/components/ui/Drawer';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';

const SECONDARY_LINKS = [
  { href: '/contact', label: 'Contact Us' },
  { href: '/about', label: 'About Us' },
  { href: '/track-order', label: 'Track Order' },
  { href: '/sell', label: 'Sell' },
  { href: '/services', label: 'Services' },
];

export default function MobileMenuDrawer({ isOpen, onClose, navLinks }) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <Drawer isOpen={isOpen} onClose={onClose} side="left" title="Menu">
      <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
        {isAuthenticated && (
          <div className="mb-2 border-b border-neutral-100 pb-2 text-sm dark:border-neutral-800">
            Hi, <span className="font-medium">{user.firstName}</span>
          </div>
        )}

        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} prefetch={false} onClick={onClose} className="rounded-md px-2 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800">
            {link.label}
          </Link>
        ))}

        <div className="my-2 border-t border-neutral-100 dark:border-neutral-800" />

        {SECONDARY_LINKS.map((link) => (
          <Link key={link.href} href={link.href} prefetch={false} onClick={onClose} className="rounded-md px-2 py-2 text-sm text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800">
            {link.label}
          </Link>
        ))}

        <div className="my-2 border-t border-neutral-100 dark:border-neutral-800" />

        {isAuthenticated ? (
          <>
            <Link href="/account/orders" onClick={onClose} className="rounded-md px-2 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">My Orders</Link>
            <Link href={ROUTES.ACCOUNT} onClick={onClose} className="rounded-md px-2 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">Account</Link>
            <Button variant="ghost" onClick={() => { logout(); onClose(); }} className="mt-1 justify-start text-danger-600">Sign Out</Button>
          </>
        ) : (
          <Link href={ROUTES.LOGIN} onClick={onClose}>
            <Button className="mt-1 w-full">Sign In</Button>
          </Link>
        )}
      </nav>
    </Drawer>
  );
}