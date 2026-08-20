'use client';

import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiBox, FiDollarSign, FiPackage, FiShoppingBag } from 'react-icons/fi';
import SellerLayout from '@/components/layout/SellerLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import PageLoader from '@/components/feedback/PageLoader';
import ErrorState from '@/components/feedback/ErrorState';
import SellerStatCard from '@/components/seller/dashboard/SellerStatCard';
import RecentSellerOrdersWidget from '@/components/seller/dashboard/RecentSellerOrdersWidget';
import { ROLES } from '@/constants/roles';
import { analyticsService } from '@/services/analyticsService';

function SellerAnalyticsContent() {
  const [metrics, setMetrics] = useState(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;

    analyticsService.sellerOverview()
      .then((response) => {
        if (!isMounted) return;
        const analytics = response.data.analytics;
        setMetrics({
          products: analytics.products,
          outOfStock: analytics.outOfStock,
          orders: analytics.orders,
          revenue: analytics.revenue,
        });
      })
      .catch((error) => {
        if (isMounted) setLoadError(error.message || 'Failed to load seller analytics');
      });

    return () => { isMounted = false; };
  }, []);

  if (loadError) return <ErrorState message={loadError} />;
  if (!metrics) return <PageLoader label="Loading analytics..." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Seller Analytics</h1>
        <p className="mt-1 text-sm text-neutral-500">A live operational snapshot of your ZAF Cart activity.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SellerStatCard label="Products" value={metrics.products} href="/seller/products" icon={FiPackage} />
        <SellerStatCard label="Orders" value={metrics.orders} href="/seller/orders" icon={FiShoppingBag} />
        <SellerStatCard label="Revenue" value={`$${metrics.revenue.toFixed(2)}`} href="/seller/orders" icon={FiDollarSign} />
        <SellerStatCard label="Out of Stock" value={metrics.outOfStock} href="/seller/inventory" icon={FiAlertTriangle} tone="text-danger-600" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentSellerOrdersWidget />
        <Card className="flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold uppercase text-neutral-500">Catalog Health</h2>
            <p className="mt-1 text-sm text-neutral-500">Manage the areas that affect your storefront performance.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <a href="/seller/products" className="flex items-center gap-3 rounded-md border border-neutral-200 p-3 text-sm hover:border-primary-500 dark:border-neutral-800">
              <FiPackage className="text-primary-600" />
              <span>Manage products</span>
            </a>
            <a href="/seller/inventory" className="flex items-center gap-3 rounded-md border border-neutral-200 p-3 text-sm hover:border-primary-500 dark:border-neutral-800">
              <FiBox className="text-primary-600" />
              <span>Review inventory</span>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function SellerAnalyticsPage() {
  return (
    <SellerLayout>
      <ProtectedRoute allowedRoles={[ROLES.SELLER]}>
        <SellerAnalyticsContent />
      </ProtectedRoute>
    </SellerLayout>
  );
}
