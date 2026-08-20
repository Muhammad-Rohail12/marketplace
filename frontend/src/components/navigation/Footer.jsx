'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

const COLUMNS = [
  {
    title: 'Get to Know Us',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press Releases', href: '/press' },
    ],
  },
  {
    title: 'Make Money With Us',
    links: [
      { label: 'Sell on ZAF Cart', href: '/sell' },
      { label: 'Become an Affiliate', href: '/affiliate' },
      { label: 'Advertise Your Products', href: '/advertise' },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Track Your Order', href: '/track-order' },
      { label: 'Returns & Refunds', href: '/returns' },
      { label: 'Shipping Info', href: '/shipping-info' },
    ],
  },
];

export default function Footer() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    showToast('Thanks for subscribing!', 'success');
    setEmail('');
  };

  return (
    <footer className="border-t border-neutral-200 bg-neutral-900 text-neutral-300 dark:border-neutral-800">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-5">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3 text-sm font-semibold text-white">{col.title}</h3>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="sm:col-span-2 lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold text-white">Stay in the Loop</h3>
          <p className="mb-3 text-sm">Sign up for deals, new arrivals, and more.</p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <Input
              id="footer-newsletter"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
            />
            <Button type="submit" size="md">Subscribe</Button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <a href="#" aria-label="Facebook" className="hover:text-white"><FiFacebook size={18} /></a>
            <a href="#" aria-label="Instagram" className="hover:text-white"><FiInstagram size={18} /></a>
            <a href="#" aria-label="Twitter" className="hover:text-white"><FiTwitter size={18} /></a>
            <a href="#" aria-label="YouTube" className="hover:text-white"><FiYoutube size={18} /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} ZAF Cart. All rights reserved. United States 🇺🇸</p>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <span className="text-neutral-600">|</span>
            <span aria-label="Accepted payment methods">Visa · Mastercard · Amex · PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}