'use client';

import { useEffect, useState } from 'react';
import SellerLayout from '@/components/layout/SellerLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import PageLoader from '@/components/feedback/PageLoader';
import EmptyState from '@/components/feedback/EmptyState';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import { orderService } from '@/services/orderService';
import { formatMoney } from '@/utils/currencyFormat';
import { ROLES } from '@/constants/roles';

const NEXT_STATUS_OPTIONS = { PAID: ['PROCESSING', 'CANCELLED'], PROCESSING: ['SHIPPED', 'CANCELLED'], SHIPPED: ['DELIVERED'] };

function SellerOrdersContent() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = () => orderService.listSeller({ limit: 50 }).then((res) => setOrders(res.data.orders)).finally(() => setIsLoading(false));
  useEffect(() => { load(); }, []);

  const handleStatusChange = async (order, newStatus) => {
    if (!newStatus) return;
    await orderService.updateSellerStatus(order.id, newStatus);
    load();
  };

  if (isLoading) return <PageLoader label="Loading orders..." />;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Orders</h1>
      {orders.length === 0 ? (
        <EmptyState title="No orders yet" message="Orders from customers will appear here." />
      ) : (
        orders.map((o) => (
          <Card key={o.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{o.orderNumber}</p>
              <p className="text-sm text-gray-500">{o.user?.firstName} {o.user?.lastName} · {formatMoney(o.grandTotal, o.currency)}</p>
            </div>
            <div className="flex items-center gap-3">
              <OrderStatusBadge status={o.status} />
              {NEXT_STATUS_OPTIONS[o.status] && (
                <Select
                  value=""
                  onChange={(e) => handleStatusChange(o, e.target.value)}
                  options={[{ value: '', label: 'Update status...' }, ...NEXT_STATUS_OPTIONS[o.status].map((s) => ({ value: s, label: s }))]}
                />
              )}
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

export default function SellerOrdersPage() {
  return (
    <SellerLayout>
      <ProtectedRoute allowedRoles={[ROLES.SELLER]}>
        <SellerOrdersContent />
      </ProtectedRoute>
    </SellerLayout>
  );
}