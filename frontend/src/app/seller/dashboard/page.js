import Link from 'next/link';
import SellerLayout from '@/components/layout/SellerLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import { ROLES } from '@/constants/roles';

const SECTIONS = [
  { title: 'Store Profile', description: 'Manage your store branding, info, and policies.', href: '/seller/store', ready: true },
  { title: 'Products', description: 'Coming in a future phase.', ready: false },
  { title: 'Orders', description: 'Coming in a future phase.', ready: false },
  { title: 'Inventory', description: 'Coming in a future phase.', ready: false },
  { title: 'Customers', description: 'Coming in a future phase.', ready: false },
  { title: 'Analytics', description: 'Coming in a future phase.', ready: false },
  { title: 'Promotions', description: 'Coming in a future phase.', ready: false },
];

export default function SellerDashboardPage() {
  return (
    <SellerLayout>
      <ProtectedRoute allowedRoles={[ROLES.SELLER]}>
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-semibold">Seller Dashboard</h1>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((section) => (
              <Card key={section.title} className={!section.ready ? 'opacity-60' : ''}>
                <h2 className="font-semibold">{section.title}</h2>
                <p className="mt-1 text-sm text-gray-500">{section.description}</p>
                {section.ready && (
                  <Link href={section.href} className="mt-3 inline-block text-sm font-medium text-primary-600 hover:underline">
                    Manage →
                  </Link>
                )}
              </Card>
            ))}
          </div>
        </div>
      </ProtectedRoute>
    </SellerLayout>
  );
}