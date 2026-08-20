'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import PageLoader from '@/components/feedback/PageLoader';
import EmptyState from '@/components/feedback/EmptyState';
import AdminOrdersTable from '@/components/admin/orders/AdminOrdersTable';
import { orderService } from '@/services/orderService';
import { ROLES } from '@/constants/roles';

function AdminOrdersContent() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderService.listAdmin({ limit: 50 }).then((res) => setOrders(res.data.orders)).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <PageLoader label="Loading orders..." />;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">All Orders</h1>
      <Card>
        {orders.length === 0 ? (
          <EmptyState title="No orders" message="No orders have been placed yet." />
        ) : (
          <AdminOrdersTable orders={orders} />
        )}
      </Card>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <AdminOrdersContent />
      </ProtectedRoute>
    </AdminLayout>
  );
}