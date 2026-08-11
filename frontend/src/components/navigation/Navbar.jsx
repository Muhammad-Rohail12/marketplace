'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ROUTES } from '@/constants/routes';
import SearchBar from './SearchBar';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { getNavLinksForRole } from './navConfig';
import { ROLES } from '@/constants/roles';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import CartIcon from '../cart/CartIcon';
import DeliveryLocationBadge from '../address/DeliveryLocationBadge';

const NAV_LINKS_WITHOUT_CART = (role) => getNavLinksForRole(role).filter((l) => l.href !== ROUTES.CART);

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const navLinks = NAV_LINKS_WITHOUT_CART(isAuthenticated ? user?.role : null);

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-surface-dark">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href={ROUTES.HOME} className="text-lg font-bold text-primary-600">
          Marketplace
        </Link>

        <DeliveryLocationBadge />

        <div className="hidden flex-1 max-w-md md:block">
          <SearchBar />
        </div>

        <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300"
            >
              {link.label}
            </Link>
          ))}

          {!isLoading && isAuthenticated && user.role === ROLES.BUYER && (
            <Link href="/sell" className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300">
              Sell
            </Link>
          )}

          {isAuthenticated && <CartIcon />}

          {!isLoading && isAuthenticated && (
            <Link
              href={ROUTES.ACCOUNT}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300"
            >
              Hi, {user.firstName}
              <Badge variant="primary">{user.role}</Badge>
            </Link>
          )}

          {!isLoading && isAuthenticated ? (
            <Button variant="ghost" size="sm" onClick={logout}>
              Log out
            </Button>
          ) : (
            !isLoading && (
              <Link
                href={ROUTES.LOGIN}
                className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300"
              >
                Log in
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <div className="md:hidden">
              <CartIcon />
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </Button>

          <button
            type="button"
            className="md:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            ☰
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav aria-label="Mobile navigation" className="border-t border-gray-200 md:hidden dark:border-gray-800">
          <div className="container-page flex flex-col gap-3 py-4">
            <SearchBar />
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!isLoading && isAuthenticated && user.role === ROLES.BUYER && (
              <Link href="/sell" className="text-sm font-medium text-gray-700 dark:text-gray-300" onClick={() => setMobileOpen(false)}>
                Sell
              </Link>
            )}
            <Link href={ROUTES.CART} className="text-sm font-medium text-gray-700 dark:text-gray-300" onClick={() => setMobileOpen(false)}>
              Cart
            </Link>
            {!isLoading && isAuthenticated && (
              <Link
                href="/account/addresses"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                onClick={() => setMobileOpen(false)}
              >
                Addresses
              </Link>
            )}
            {!isLoading && isAuthenticated && (
              <Link
                href={ROUTES.ACCOUNT}
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                onClick={() => setMobileOpen(false)}
              >
                Account ({user.role})
              </Link>
            )}
            {!isLoading && isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="text-left text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Log out
              </button>
            ) : (
              !isLoading && (
                <Link
                  href={ROUTES.LOGIN}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
}