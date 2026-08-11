import DashboardLayout from './DashboardLayout';

const SELLER_LINKS = [
  { label: 'Overview', href: '/seller/dashboard' },
  { label: 'Store', href: '/seller/store' },
  { label: 'Products', href: '/seller/products' },
  { label: 'Inventory', href: '/seller/inventory' },
  { label: 'Pricing', href: '/seller/pricing' },
  { label: 'Orders', href: '/seller/orders' },
  { label: 'Analytics', href: '/seller/analytics' },
];

export default function SellerLayout({ children }) {
  return (
    <DashboardLayout sidebarLinks={SELLER_LINKS} sidebarTitle="Seller">
      {children}
    </DashboardLayout>
  );
}