'use client';

import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatMoney } from '@/utils/currencyFormat';
import { formatDate } from '@/utils/formatDate';

export default function PricingTable({ items, onEdit, onDiscount, onHistory }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800">
            <th className="py-2 pr-4">Product</th>
            <th className="py-2 pr-4">Variant</th>
            <th className="py-2 pr-4">Base Price</th>
            <th className="py-2 pr-4">Effective Price</th>
            <th className="py-2 pr-4">Discount</th>
            <th className="py-2 pr-4">Updated</th>
            <th className="py-2 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="border-b border-gray-100 dark:border-gray-900">
              <td className="py-2 pr-4">{p.product?.name}</td>
              <td className="py-2 pr-4">{p.variant?.name || '—'}</td>
              <td className="py-2 pr-4">{formatMoney(p.basePrice, p.currency)}</td>
              <td className="py-2 pr-4 font-medium">{formatMoney(p.effective?.effectivePrice, p.currency)}</td>
              <td className="py-2 pr-4">
                {p.effective?.hasDiscount ? <Badge variant="danger">{p.effective.discountPercentage}% OFF</Badge> : '—'}
              </td>
              <td className="py-2 pr-4">{formatDate(p.updatedAt)}</td>
              <td className="flex flex-wrap gap-1 py-2 pr-4">
                <Button variant="ghost" size="sm" onClick={() => onEdit(p)}>Edit Price</Button>
                <Button variant="ghost" size="sm" onClick={() => onDiscount(p)}>Discount</Button>
                <Button variant="ghost" size="sm" onClick={() => onHistory(p)}>History</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}