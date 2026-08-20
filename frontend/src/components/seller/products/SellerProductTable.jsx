'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import ProductStatusBadge from '@/components/product/ProductStatusBadge';
import ResponsiveDataTable from '@/components/ui/ResponsiveDataTable';
import { formatDate } from '@/utils/formatDate';

export default function SellerProductTable({ products, onDuplicate, onArchive }) {
  const columns = [
    { key: 'name', label: 'Name', render: (p) => p.name },
    { key: 'sku', label: 'SKU', render: (p) => p.sku || '—', hideOnMobile: true },
    { key: 'category', label: 'Category', render: (p) => p.category?.name },
    { key: 'brand', label: 'Brand', render: (p) => p.brand?.name || 'Unbranded', hideOnMobile: true },
    { key: 'status', label: 'Status', render: (p) => <ProductStatusBadge status={p.status} /> },
    { key: 'updatedAt', label: 'Updated', render: (p) => formatDate(p.updatedAt), hideOnMobile: true },
  ];

  const actions = (p) => (
    <>
      {p.status === 'ACTIVE' && p.slug && (
        <Link href={`/product/${p.slug}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
          View public
        </Link>
      )}
      <Link href={`/seller/products/${p.id}/edit`} className="text-primary-600 hover:underline">Edit</Link>
      <Button variant="ghost" size="sm" onClick={() => onDuplicate(p)}>Duplicate</Button>
      {['DRAFT', 'ACTIVE', 'INACTIVE'].includes(p.status) && (
        <Button variant="ghost" size="sm" onClick={() => onArchive(p)}>Archive</Button>
      )}
    </>
  );

  return <ResponsiveDataTable columns={columns} rows={products} rowKey="id" actions={actions} emptyMessage="No products yet." />;
}