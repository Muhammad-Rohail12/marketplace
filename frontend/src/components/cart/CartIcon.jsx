'use client';

import { useState, useRef, useEffect } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import MiniCart from './MiniCart';

export default function CartIcon() {
  const { count } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Cart, ${count} items`}
        className="relative flex items-center rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <FiShoppingCart size={20} />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>
      {isOpen && <MiniCart onClose={() => setIsOpen(false)} />}
    </div>
  );
}