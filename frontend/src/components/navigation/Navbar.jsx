'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ROUTES } from '@/constants/routes';
import SearchBar from './SearchBar';
import CategoryDropdown from './CategoryDropdown';
import AccountMenu from './AccountMenu';
import MobileMenuDrawer from './MobileMenuDrawer';
import TopUtilityBar from './TopUtilityBar';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { getNavLinksForRole } from './navConfig';
import { ROLES } from '@/constants/roles';
import Button from '../ui/Button';
import CartIcon from '../cart/CartIcon';
import DeliveryLocationBadge from '../address/DeliveryLocationBadge';
import { FiMenu } from 'react-icons/fi';

const NAV_LINKS_WITHOUT_CART = (role) => getNavLinksForRole(role).filter((l) => l.href !== ROUTES.CART);

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isLoading } = useAuth();

  const navLinks = NAV_LINKS_WITHOUT_CART(isAuthenticated ? user?.role : null);

  return (
    <>
      <TopUtilityBar />

      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-surface-dark">
        {/* Row 1: logo, deliver-to, search, account, cart */}
        <div className="container-page flex h-16 items-center gap-3">
          <button
            type="button"
            className="lg:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <FiMenu size={22} />
          </button>

          <Link href={ROUTES.HOME} className="shrink-0 text-xl font-bold text-primary-600">
            Marketplace
          </Link>

          <DeliveryLocationBadge />

          <div className="hidden flex-1 md:block">
            <SearchBar />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle theme" className="hidden sm:inline-flex">
              {theme === 'light' ? '🌙' : '☀️'}
            </Button>

            {!isLoading && isAuthenticated && user.role === ROLES.BUYER && (
              <Link href="/sell" className="hidden text-sm font-medium hover:text-primary-600 lg:block">Sell</Link>
            )}

            <div className="hidden lg:block">
              <AccountMenu />
            </div>

            {isAuthenticated && <CartIcon />}
          </div>
        </div>

        {/* Mobile search — full width on its own row */}
        <div className="container-page pb-3 md:hidden">
          <SearchBar />
        </div>

        {/* Row 2: category selector + primary nav (desktop only) */}
        <div className="hidden border-t border-neutral-100 dark:border-neutral-800 lg:block">
          <div className="container-page flex h-11 items-center gap-4">
            <CategoryDropdown />
            <nav aria-label="Main navigation" className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} prefetch={false} className="text-sm font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-300">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <MobileMenuDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} navLinks={navLinks} />
    </>
  );
}