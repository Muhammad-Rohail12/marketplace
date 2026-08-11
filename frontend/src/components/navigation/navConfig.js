import { ROLES } from '@/constants/roles';

// Central nav-by-role config. Dashboard routes are placeholders —
// the pages themselves don't exist until the Seller/Admin dashboard
// phases, so links are prepared here but only rendered once those
// routes are real (see Navbar.jsx: currently used only for the role
// badge and the demo test links below, not full dashboard nav yet).
export const NAV_CONFIG = {
  guest: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
  ],
  [ROLES.BUYER]: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Cart', href: '/cart' },
  ],
  [ROLES.SELLER]: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Cart', href: '/cart' },
    // { label: 'Seller Dashboard', href: '/seller/dashboard' }, // enabled once that phase ships
  ],
  [ROLES.ADMIN]: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    // { label: 'Admin Dashboard', href: '/admin/dashboard' }, // enabled once that phase ships
  ],
};

export function getNavLinksForRole(role) {
  return NAV_CONFIG[role] || NAV_CONFIG.guest;
}