'use client';

import Button from '@/components/ui/Button';
import ProductStatusBadge from '@/components/product/ProductStatusBadge';

export default function ProductTable({ products, onView }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800">
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Seller</th>
            <th className="py-2 pr-4">Store</th>
            <th className="py-2 pr-4">Category</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-gray-100 dark:border-gray-900">
              <td className="py-2 pr-4">{p.name}</td>
              <td className="py-2 pr-4">{p.seller?.user?.firstName} {p.seller?.user?.lastName}</td>
              <td className="py-2 pr-4">{p.store?.name}</td>
              <td className="py-2 pr-4">{p.category?.name}</td>
              <td className="py-2 pr-4"><ProductStatusBadge status={p.status} /></td>
              <td className="py-2 pr-4"><Button variant="ghost" size="sm" onClick={() => onView(p)}>Review</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}