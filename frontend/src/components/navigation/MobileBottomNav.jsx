'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiGrid, FiShoppingCart, FiUser } from 'react-icons/fi';
import { cn } from '@/utils/cn';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';

const ITEMS = [
  { href: ROUTES.HOME, label: 'Home', icon: FiHome },
  { href: '/categories', label: 'Categories', icon: FiGrid },
  { href: '/cart', label: 'Cart', icon: FiShoppingCart, showCartBadge: true },
  { href: null, label: 'Account', icon: FiUser, isAccount: true },
];

// Fixed bottom tab bar, mobile-only (hidden md+). Real routes only —
// Account tab points to /login when signed out, /account when in.
// Hidden on seller/admin/checkout routes where a dashboard sidebar
// or focused checkout flow already owns the screen.
export default function MobileBottomNav() {
  const pathname = usePathname();
  const { count } = useCart();
  const { isAuthenticated } = useAuth();

  const hiddenPrefixes = ['/seller', '/admin', '/checkout', '/login', '/register'];
  if (hiddenPrefixes.some((p) => pathname.startsWith(p))) return null;

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-neutral-200 bg-white pb-[env(safe-area-inset-bottom)] dark:border-neutral-800 dark:bg-neutral-900 md:hidden"
    >
      {ITEMS.map((item) => {
        const href = item.isAccount ? (isAuthenticated ? '/account' : ROUTES.LOGIN) : item.href;
        const isActive = pathname === href || (href !== ROUTES.HOME && pathname.startsWith(href));
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={href}
            className={cn(
              'relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-2xs font-medium',
              isActive ? 'text-primary-600' : 'text-neutral-500'
            )}
          >
            <Icon size={20} />
            {item.label}
            {item.showCartBadge && count > 0 && (
              <span className="absolute right-1/4 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}