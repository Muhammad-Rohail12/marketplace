import DashboardLayout from './DashboardLayout';

const ADMIN_LINKS = [
  { label: 'Overview', href: '/admin/dashboard' },
  { label: 'Categories', href: '/admin/categories' },
  { label: 'Brands', href: '/admin/brands' },
  { label: 'Attributes', href: '/admin/attributes' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Seller Applications', href: '/admin/sellers' },
  { label: 'Stores', href: '/admin/stores' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Inventory', href: '/admin/inventory' },
  { label: 'Pricing', href: '/admin/pricing' },
  { label: 'Orders', href: '/admin/orders' },
];

export default function AdminLayout({ children }) {
  return (
    <DashboardLayout sidebarLinks={ADMIN_LINKS} sidebarTitle="Admin">
      {children}
    </DashboardLayout>
  );
}