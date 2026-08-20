'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import InventoryStatusBadge from '@/components/seller/inventory/InventoryStatusBadge';
import { inventoryService } from '@/services/inventoryService';

export default function LowStockAlertList() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    inventoryService.listMine({ status: 'LOW_STOCK', limit: 5 }).then((res) => setItems(res.data.inventory)).catch(() => setItems([]));
  }, []);

  if (items === null) return null;
  if (items.length === 0) return null;

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase text-neutral-500">Low Stock Alerts</h2>
        <Link href="/seller/inventory" className="text-xs font-medium text-primary-600 hover:underline">View all →</Link>
      </div>
      {items.map((inv) => (
        <div key={inv.id} className="flex items-center justify-between text-sm">
          <span>{inv.product?.name}{inv.variant ? ` — ${inv.variant.name}` : ''}</span>
          <InventoryStatusBadge status={inv.status} />
        </div>
      ))}
    </Card>
  );
}