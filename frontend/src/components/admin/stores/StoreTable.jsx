'use client';

import StoreLogo from '@/components/store/StoreLogo';
import StoreStatusBadge from '@/components/store/StoreStatusBadge';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function StoreTable({ stores, onView, onSuspend, onActivate, onFeature }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800">
            <th className="py-2 pr-4">Store</th>
            <th className="py-2 pr-4">Owner</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Flags</th>
            <th className="py-2 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id} className="border-b border-gray-100 dark:border-gray-900">
              <td className="flex items-center gap-2 py-2 pr-4">
                <StoreLogo store={store} size={32} />
                {store.name}
              </td>
              <td className="py-2 pr-4">{store.seller?.user?.firstName} {store.seller?.user?.lastName}</td>
              <td className="py-2 pr-4"><StoreStatusBadge status={store.status} /></td>
              <td className="py-2 pr-4">{store.isFeatured && <Badge variant="warning">Featured</Badge>}</td>
              <td className="flex flex-wrap gap-1 py-2 pr-4">
                <Button variant="ghost" size="sm" onClick={() => onView(store)}>View</Button>
                {store.status !== 'SUSPENDED' ? (
                  <Button variant="ghost" size="sm" onClick={() => onSuspend(store)}>Suspend</Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => onActivate(store)}>Activate</Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => onFeature(store)}>
                  {store.isFeatured ? 'Unfeature' : 'Feature'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}