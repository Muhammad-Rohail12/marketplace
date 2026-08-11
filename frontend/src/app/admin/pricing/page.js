'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Pagination from '@/components/ui/Pagination';
import PageLoader from '@/components/feedback/PageLoader';
import EmptyState from '@/components/feedback/EmptyState';
import ErrorState from '@/components/feedback/ErrorState';
import { pricingService } from '@/services/pricingService';
import { useDebounce } from '@/hooks/useDebounce';
import { formatMoney } from '@/utils/currencyFormat';
import { ROLES } from '@/constants/roles';

function AdminPricingContent() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await pricingService.listAll({ page, limit: 20, search: debouncedSearch });
      setItems(res.data.pricing);
      setMeta(res.meta);
    } catch (err) {
      setLoadError(err.message || 'Failed to load pricing');
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadData(); }, [loadData]);

  if (isLoading) return <PageLoader label="Loading pricing..." />;
  if (loadError) return <ErrorState message={loadError} onRetry={loadData} />;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Pricing (All Sellers)</h1>

      <Card>
        <Input placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </Card>

      <Card>
        {items.length === 0 ? (
          <EmptyState title="No pricing records" message="No pricing matches your filters." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800">
                    <th className="py-2 pr-4">Product</th>
                    <th className="py-2 pr-4">Seller</th>
                    <th className="py-2 pr-4">Store</th>
                    <th className="py-2 pr-4">Base Price</th>
                    <th className="py-2 pr-4">Cost Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100 dark:border-gray-900">
                      <td className="py-2 pr-4">{p.product?.name}</td>
                      <td className="py-2 pr-4">{p.seller?.user?.firstName} {p.seller?.user?.lastName}</td>
                      <td className="py-2 pr-4">{p.store?.name}</td>
                      <td className="py-2 pr-4">{formatMoney(p.basePrice, p.currency)}</td>
                      <td className="py-2 pr-4 text-gray-400">{p.costPrice ? formatMoney(p.costPrice, p.currency) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4"><Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} /></div>
          </>
        )}
      </Card>
    </div>
  );
}

export default function AdminPricingPage() {
  return (
    <AdminLayout>
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <AdminPricingContent />
      </ProtectedRoute>
    </AdminLayout>
  );
}