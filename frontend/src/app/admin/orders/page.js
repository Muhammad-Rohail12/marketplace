'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import PageLoader from '@/components/feedback/PageLoader';
import EmptyState from '@/components/feedback/EmptyState';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import { orderService } from '@/services/orderService';
import { formatMoney } from '@/utils/currencyFormat';
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
      {orders.length === 0 ? (
        <EmptyState title="No orders" message="No orders have been placed yet." />
      ) : (
        orders.map((o) => (
          <Card key={o.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{o.orderNumber}</p>
              <p className="text-sm text-gray-500">{o.store?.name} · {o.user?.firstName} {o.user?.lastName}</p>
            </div>
            <div className="flex items-center gap-3">
              <OrderStatusBadge status={o.status} />
              <span className="font-semibold">{formatMoney(o.grandTotal, o.currency)}</span>
            </div>
          </Card>
        ))
      )}
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