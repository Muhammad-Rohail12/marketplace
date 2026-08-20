'use client';

import { useEffect, useState } from 'react';
import { FiUsers, FiPackage, FiShoppingBag, FiGrid, FiTag, FiBox } from 'react-icons/fi';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminStatCard from '@/components/admin/dashboard/AdminStatCard';
import PendingApplicationsWidget from '@/components/admin/dashboard/PendingApplicationsWidget';
import PendingProductsWidget from '@/components/admin/dashboard/PendingProductsWidget';
import RecentOrdersAdminWidget from '@/components/admin/dashboard/RecentOrdersAdminWidget';
import PlatformLowStockWidget from '@/components/admin/dashboard/PlatformLowStockWidget';
import AdminQuickActions from '@/components/admin/dashboard/AdminQuickActions';
import { sellerApplicationService } from '@/services/sellerApplicationService';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';
import { storeService } from '@/services/storeService';
import { listCategories } from '@/services/categoryService';
import { listBrands } from '@/services/brandService';
import { ROLES } from '@/constants/roles';

function AdminDashboardContent() {
  const [pendingApplications, setPendingApplications] = useState('—');
  const [pendingProducts, setPendingProducts] = useState('—');
  const [orderCount, setOrderCount] = useState('—');
  const [storeCount, setStoreCount] = useState('—');
  const [categoryCount, setCategoryCount] = useState('—');
  const [brandCount, setBrandCount] = useState('—');

  useEffect(() => {
    sellerApplicationService.listAll({ status: 'SUBMITTED', limit: 1 }).then((res) => setPendingApplications(res.meta?.totalCount ?? 0)).catch(() => setPendingApplications(0));
    productService.listAll({ status: 'PENDING_REVIEW', limit: 1 }).then((res) => setPendingProducts(res.meta?.totalCount ?? 0)).catch(() => setPendingProducts(0));
    orderService.listAdmin({ limit: 1 }).then((res) => setOrderCount(res.meta?.totalCount ?? 0)).catch(() => setOrderCount(0));
    storeService.list({ limit: 1 }).then((res) => setStoreCount(res.meta?.totalCount ?? 0)).catch(() => setStoreCount(0));
    listCategories({ limit: 1 }).then((res) => setCategoryCount(res.meta?.totalCount ?? res.data.categories.length)).catch(() => setCategoryCount(0));
    listBrands({ limit: 1 }).then((res) => setBrandCount(res.meta?.totalCount ?? res.data.brands.length)).catch(() => setBrandCount(0));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <AdminStatCard label="Pending Applications" value={pendingApplications} href="/admin/sellers" icon={FiUsers} tone="text-warning-600" />
        <AdminStatCard label="Products to Review" value={pendingProducts} href="/admin/products" icon={FiPackage} tone="text-warning-600" />
        <AdminStatCard label="Total Orders" value={orderCount} href="/admin/orders" icon={FiShoppingBag} />
        <AdminStatCard label="Active Stores" value={storeCount} href="/admin/stores" icon={FiBox} />
        <AdminStatCard label="Categories" value={categoryCount} href="/admin/categories" icon={FiGrid} />
        <AdminStatCard label="Brands" value={brandCount} href="/admin/brands" icon={FiTag} />
      </div>

      <AdminQuickActions />

      <div className="grid gap-4 lg:grid-cols-2">
        <PendingApplicationsWidget />
        <PendingProductsWidget />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentOrdersAdminWidget />
        <PlatformLowStockWidget />
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <AdminDashboardContent />
      </ProtectedRoute>
    </AdminLayout>
  );
}