'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import EmptyState from '@/components/feedback/EmptyState';
import { orderService } from '@/services/orderService';
import { formatMoney } from '@/utils/currencyFormat';
import { formatDate } from '@/utils/formatDate';

export default function RecentOrdersWidget() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    orderService.listMine({ limit: 3 }).then((res) => setOrders(res.data.orders)).catch(() => setOrders([]));
  }, []);

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase text-neutral-500">Recent Orders</h2>
        <Link href="/account/orders" className="text-xs font-medium text-primary-600 hover:underline">View all →</Link>
      </div>

      {orders === null ? (
        <p className="text-sm text-neutral-400">Loading...</p>
      ) : orders.length === 0 ? (
        <EmptyState title="No orders yet" message="Your placed orders will appear here." />
      ) : (
        <div className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-900">
          {orders.map((o) => (
            <Link key={o.id} href={`/account/orders/${o.id}`} className="flex items-center justify-between py-2 text-sm">
              <div>
                <p className="font-medium">{o.orderNumber}</p>
                <p className="text-xs text-neutral-500">{o.store?.name} · {formatDate(o.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <OrderStatusBadge status={o.status} />
                <span className="font-semibold">{formatMoney(o.grandTotal, o.currency)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}