'use client';

import InventoryStatusBadge from '@/components/seller/inventory/InventoryStatusBadge';
import Button from '@/components/ui/Button';

export default function AdminInventoryTable({ items, onAdjust, onHistory }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800">
            <th className="py-2 pr-4">Product</th>
            <th className="py-2 pr-4">Seller</th>
            <th className="py-2 pr-4">Store</th>
            <th className="py-2 pr-4">Stock</th>
            <th className="py-2 pr-4">Available</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((inv) => (
            <tr key={inv.id} className="border-b border-gray-100 dark:border-gray-900">
              <td className="py-2 pr-4">{inv.product?.name}</td>
              <td className="py-2 pr-4">{inv.seller?.user?.firstName} {inv.seller?.user?.lastName}</td>
              <td className="py-2 pr-4">{inv.store?.name}</td>
              <td className="py-2 pr-4">{inv.quantity}</td>
              <td className="py-2 pr-4">{inv.availableQuantity}</td>
              <td className="py-2 pr-4"><InventoryStatusBadge status={inv.status} /></td>
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