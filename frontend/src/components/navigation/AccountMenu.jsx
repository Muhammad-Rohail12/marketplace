'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FiUser, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';

export default function AccountMenu() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) return null;

  if (!isAuthenticated) {
    return (
      <Link href={ROUTES.LOGIN} className="flex items-center gap-1 text-sm font-medium hover:text-primary-600">
        <FiUser size={18} />
        <span className="hidden lg:flex lg:flex-col lg:leading-tight">
          <span className="text-2xs text-neutral-400">Hello, sign in</span>
          <span>Account</span>
        </span>
      </Link>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        aria-expanded={isOpen}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <FiUser size={18} />
        <span className="hidden lg:flex lg:flex-col lg:leading-tight lg:text-left">
          <span className="text-2xs text-neutral-400">Hi, {user.firstName}</span>
          <span className="flex items-center gap-1">Account <FiChevronDown size={12} /></span>
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-40 mt-2 w-56 rounded-lg border border-neutral-200 bg-white py-2 shadow-dropdown dark:border-neutral-800 dark:bg-neutral-900">
          <div className="border-b border-neutral-100 px-4 py-2 text-xs text-neutral-500 dark:border-neutral-800">
            Signed in as <span className="font-medium text-neutral-800 dark:text-neutral-200">{user.email}</span>
          </div>
          <Link href="/account" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">Account Overview</Link>
          <Link href="/account/orders" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">My Orders</Link>
          <Link href="/account/wishlist" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">Wishlist</Link>
          <Link href={ROUTES.ACCOUNT} onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">Account Settings</Link>
          <Link href="/account/addresses" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">Addresses</Link>
          {user.role === 'SELLER' && (
            <Link href="/seller/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">Seller Dashboard</Link>
          )}
          {user.role === 'ADMIN' && (
            <Link href="/admin/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">Admin Dashboard</Link>
          )}
          <button
            type="button"
            onClick={() => { logout(); setIsOpen(false); }}
            className="block w-full border-t border-neutral-100 px-4 py-2 text-left text-sm text-danger-600 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}