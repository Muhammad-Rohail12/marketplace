import Link from 'next/link';

// Bottom mobile navigation bar — architecture placeholder for
// future dashboard/account mobile experiences.
export default function MobileNav({ links = [] }) {
  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-gray-200 bg-white py-2 md:hidden dark:border-gray-800 dark:bg-surface-dark"
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-400"
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
