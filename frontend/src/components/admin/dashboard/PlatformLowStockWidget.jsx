'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import InventoryStatusBadge from '@/components/seller/inventory/InventoryStatusBadge';
import EmptyState from '@/components/feedback/EmptyState';
import { inventoryService } from '@/services/inventoryService';

export default function PlatformLowStockWidget() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    inventoryService.listAll({ status: 'LOW_STOCK', limit: 6 }).then((res) => setItems(res.data.inventory)).catch(() => setItems([]));
  }, []);

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase text-neutral-500">Low Stock — All Sellers</h2>
        <Link href="/admin/inventory" className="text-xs font-medium text-primary-600 hover:underline">View all →</Link>
      </div>
      {items === null ? (
        <p className="text-sm text-neutral-400">Loading...</p>
      ) : items.length === 0 ? (
        <EmptyState title="Nothing low on stock" message="Inventory levels look healthy across ZAF Cart." />
      ) : (
        <div className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-900">
          {items.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between py-2 text-sm">
              <div>
                <p className="font-medium">{inv.product?.name}</p>
                <p className="text-xs text-neutral-500">{inv.seller?.user?.firstName} {inv.seller?.user?.lastName} · {inv.store?.name}</p>
              </div>
              <InventoryStatusBadge status={inv.status} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}