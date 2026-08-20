import Link from 'next/link';
import { FiUsers, FiPackage, FiGrid, FiTag } from 'react-icons/fi';

const ACTIONS = [
  { label: 'Review Applications', href: '/admin/sellers', icon: FiUsers },
  { label: 'Review Products', href: '/admin/products', icon: FiPackage },
  { label: 'Manage Categories', href: '/admin/categories', icon: FiGrid },
  { label: 'Manage Brands', href: '/admin/brands', icon: FiTag },
];

export default function AdminQuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ACTIONS.map(({ label, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex flex-col items-center gap-2 rounded-lg border border-neutral-200 p-4 text-center text-sm font-medium hover:border-primary-300 hover:shadow-elevated dark:border-neutral-800"
        >
          <Icon size={20} className="text-primary-600" />
          {label}
        </Link>
      ))}
    </div>
  );
}