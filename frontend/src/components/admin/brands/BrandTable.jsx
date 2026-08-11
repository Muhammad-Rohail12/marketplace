'use client';

import BrandLogo from '@/components/brand/BrandLogo';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function BrandTable({ brands, onEdit, onDelete, onRestore }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800">
            <th className="py-2 pr-4">Brand</th>
            <th className="py-2 pr-4">Country</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Flags</th>
            <th className="py-2 pr-4">Order</th>
            <th className="py-2 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand.id} className="border-b border-gray-100 dark:border-gray-900">
              <td className="flex items-center gap-2 py-2 pr-4">
                <BrandLogo brand={brand} size={32} />
                {brand.name}
              </td>
              <td className="py-2 pr-4">{brand.country || '—'}</td>
              <td className="py-2 pr-4">
                <Badge variant={brand.status === 'ACTIVE' ? 'success' : 'neutral'}>{brand.status}</Badge>
                {brand.deletedAt && <Badge variant="danger" className="ml-1">Deleted</Badge>}
              </td>
              <td className="py-2 pr-4 flex gap-1">
                {brand.isVerified && <Badge variant="primary">Verified</Badge>}
                {brand.isFeatured && <Badge variant="warning">Featured</Badge>}
                {brand.showOnHomepage && <Badge variant="neutral">Homepage</Badge>}
              </td>
              <td className="py-2 pr-4">{brand.displayOrder}</td>
              <td className="py-2 pr-4">
                {brand.deletedAt ? (
                  <Button variant="ghost" size="sm" onClick={() => onRestore(brand)}>
                    Restore
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(brand)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(brand)}>
                      Delete
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}