import DashboardLayout from '@/components/layout/DashboardLayout';

const ACCOUNT_LINKS = [
  { label: 'Overview', href: '/account' },
  { label: 'Orders', href: '/account/orders' },
  { label: 'Addresses', href: '/account/addresses' },
  { label: 'Wishlist', href: '/account/wishlist' },
  { label: 'Profile & Security', href: '/account/profile' },
];

export default function AccountLayout({ children }) {
  return (
    <DashboardLayout sidebarLinks={ACCOUNT_LINKS} sidebarTitle="My Account">
      {children}
    </DashboardLayout>
  );
}