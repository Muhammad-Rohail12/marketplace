'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AccountLayout from '@/components/account/AccountLayout';
import Card from '@/components/ui/Card';
import PageLoader from '@/components/feedback/PageLoader';
import EmptyState from '@/components/feedback/EmptyState';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import { orderService } from '@/services/orderService';
import { formatMoney } from '@/utils/currencyFormat';
import { formatDate } from '@/utils/formatDate';

function MyOrdersContent() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderService.listMine({ limit: 50 }).then((res) => setOrders(res.data.orders)).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <PageLoader label="Loading orders..." />;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">My Orders</h1>
      {orders.length === 0 ? (
        <EmptyState title="No orders yet" message="Your placed orders will appear here." />
      ) : (
        orders.map((o) => (
          <Link key={o.id} href={`/account/orders/${o.id}`}>
            <Card className="flex items-center justify-between">
              <div>
                <p className="font-medium">{o.orderNumber}</p>
                <p className="text-sm text-neutral-500">{o.store?.name} · {formatDate(o.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={o.status} />
                <span className="font-semibold">{formatMoney(o.grandTotal, o.currency)}</span>
              </div>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}

export default function MyOrdersPage() {
  return (
    <AccountLayout>
      <ProtectedRoute>
        <MyOrdersContent />
      </ProtectedRoute>
    </AccountLayout>
  );
}