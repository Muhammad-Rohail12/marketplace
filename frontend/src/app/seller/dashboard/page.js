'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiPackage, FiBox, FiDollarSign, FiShoppingBag, FiAlertTriangle } from 'react-icons/fi';
import SellerLayout from '@/components/layout/SellerLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SellerStatCard from '@/components/seller/dashboard/SellerStatCard';
import LowStockAlertList from '@/components/seller/dashboard/LowStockAlertList';
import RecentSellerOrdersWidget from '@/components/seller/dashboard/RecentSellerOrdersWidget';
import { productService } from '@/services/productService';
import { inventoryService } from '@/services/inventoryService';
import { orderService } from '@/services/orderService';
import { ROLES } from '@/constants/roles';

function SellerDashboardContent() {
  const [productCount, setProductCount] = useState('—');
  const [outOfStockCount, setOutOfStockCount] = useState('—');
  const [orderCount, setOrderCount] = useState('—');
  const [pricingCount, setPricingCount] = useState('—');

  useEffect(() => {
    productService.listMine({ limit: 1 }).then((res) => setProductCount(res.meta?.totalCount ?? 0)).catch(() => setProductCount(0));
    inventoryService.getSummary().then((res) => setOutOfStockCount(res.data.summary.outOfStockCount)).catch(() => setOutOfStockCount(0));
    orderService.listSeller({ limit: 1 }).then((res) => setOrderCount(res.meta?.totalCount ?? 0)).catch(() => setOrderCount(0));
    require('@/services/pricingService').pricingService.listMine({ limit: 1 }).then((res) => setPricingCount(res.meta?.totalCount ?? 0)).catch(() => setPricingCount(0));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Seller Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SellerStatCard label="Products" value={productCount} href="/seller/products" icon={FiPackage} />
        <SellerStatCard label="Priced Listings" value={pricingCount} href="/seller/pricing" icon={FiDollarSign} />
        <SellerStatCard label="Out of Stock" value={outOfStockCount} href="/seller/inventory" icon={FiAlertTriangle} tone="text-danger-600" />
        <SellerStatCard label="Orders" value={orderCount} href="/seller/orders" icon={FiShoppingBag} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentSellerOrdersWidget />
        <LowStockAlertList />
      </div>

      <Link href="/seller/store" className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 hover:shadow-elevated dark:border-neutral-800">
        <FiBox size={22} className="text-primary-600" />
        <div>
          <p className="font-medium">Store Profile</p>
          <p className="text-sm text-neutral-500">Manage your store branding, info, and policies.</p>
        </div>
      </Link>
    </div>
  );
}

export default function SellerDashboardPage() {
  return (
    <SellerLayout>
      <ProtectedRoute allowedRoles={[ROLES.SELLER]}>
        <SellerDashboardContent />
      </ProtectedRoute>
    </SellerLayout>
  );
}