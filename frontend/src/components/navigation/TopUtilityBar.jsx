import Link from 'next/link';

export default function TopUtilityBar() {
  return (
    <div className="hidden bg-neutral-900 text-neutral-300 md:block">
      <div className="container-page flex h-9 items-center justify-between text-xs">
        <p>Welcome to ZAF Cart — Free shipping on eligible US orders</p>
        <nav aria-label="Utility navigation" className="flex items-center gap-4">
          <Link href="/deals" className="font-medium text-secondary-400 hover:text-secondary-300">Today&apos;s Deals</Link>
          <Link href="/contact" className="hover:text-white">Contact Us</Link>
          <Link href="/about" className="hover:text-white">About Us</Link>
          <Link href="/track-order" className="hover:text-white">Track Order</Link>
          <Link href="/sell" className="hover:text-white">Sell</Link>
          <Link href="/services" prefetch={false} className="hover:text-white">Services</Link>
        </nav>
      </div>
    </div>
  );
}