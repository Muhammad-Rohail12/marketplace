'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import ProductStatusBadge from '@/components/product/ProductStatusBadge';
import { formatDate } from '@/utils/formatDate';

export default function SellerProductTable({ products, onDuplicate, onArchive }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800">
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">SKU</th>
            <th className="py-2 pr-4">Category</th>
            <th className="py-2 pr-4">Brand</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Updated</th>
            <th className="py-2 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-gray-100 dark:border-gray-900">
              <td className="py-2 pr-4">{p.name}</td>
              <td className="py-2 pr-4">{p.sku || '—'}</td>
              <td className="py-2 pr-4">{p.category?.name}</td>
              <td className="py-2 pr-4">{p.brand?.name || 'Unbranded'}</td>
              <td className="py-2 pr-4"><ProductStatusBadge status={p.status} /></td>
              <td className="py-2 pr-4">{formatDate(p.updatedAt)}</td>
              <td className="flex flex-wrap gap-1 py-2 pr-4">
                <Link href={`/seller/products/${p.id}/edit`} className="text-primary-600 hover:underline">Edit</Link>
                <Button variant="ghost" size="sm" onClick={() => onDuplicate(p)}>Duplicate</Button>
                {['DRAFT', 'ACTIVE', 'INACTIVE'].includes(p.status) && (
                  <Button variant="ghost" size="sm" onClick={() => onArchive(p)}>Archive</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}