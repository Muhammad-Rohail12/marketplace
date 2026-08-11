'use client';

import InventoryStatusBadge from './InventoryStatusBadge';
import Button from '@/components/ui/Button';
import { formatDate } from '@/utils/formatDate';

export default function InventoryTable({ items, onAdjust, onHistory }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800">
            <th className="py-2 pr-4">Product</th>
            <th className="py-2 pr-4">Variant</th>
            <th className="py-2 pr-4">SKU</th>
            <th className="py-2 pr-4">Stock</th>
            <th className="py-2 pr-4">Reserved</th>
            <th className="py-2 pr-4">Available</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Updated</th>
            <th className="py-2 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((inv) => (
            <tr key={inv.id} className="border-b border-gray-100 dark:border-gray-900">
              <td className="py-2 pr-4">{inv.product?.name}</td>
              <td className="py-2 pr-4">{inv.variant?.name || '—'}</td>
              <td className="py-2 pr-4">{inv.sku || '—'}</td>
              <td className="py-2 pr-4">{inv.quantity}</td>
              <td className="py-2 pr-4">{inv.reservedQuantity}</td>
              <td className="py-2 pr-4 font-medium">{inv.availableQuantity}</td>
              <td className="py-2 pr-4"><InventoryStatusBadge status={inv.status} /></td>
              <td className="py-2 pr-4">{formatDate(inv.updatedAt)}</td>
              <td className="flex gap-1 py-2 pr-4">
                <Button variant="ghost" size="sm" onClick={() => onAdjust(inv)}>Adjust</Button>
                <Button variant="ghost" size="sm" onClick={() => onHistory(inv)}>History</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}