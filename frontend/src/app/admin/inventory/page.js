'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';
import PageLoader from '@/components/feedback/PageLoader';
import EmptyState from '@/components/feedback/EmptyState';
import ErrorState from '@/components/feedback/ErrorState';
import AdminInventoryTable from '@/components/admin/inventory/AdminInventoryTable';
import AdminAdjustModal from '@/components/admin/inventory/AdminAdjustModal';
import StockHistoryModal from '@/components/seller/inventory/StockHistoryModal';
import { inventoryService } from '@/services/inventoryService';
import { useDebounce } from '@/hooks/useDebounce';
import { useModal } from '@/hooks/useModal';
import { ROLES } from '@/constants/roles';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'IN_STOCK', label: 'In Stock' },
  { value: 'LOW_STOCK', label: 'Low Stock' },
  { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
];

function AdminInventoryContent() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const adjustModal = useModal(false);
  const historyModal = useModal(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await inventoryService.listAll({ page, limit: 20, status, search: debouncedSearch });
      setItems(res.data.inventory);
      setMeta(res.meta);
    } catch (err) {
      setLoadError(err.message || 'Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  }, [page, status, debouncedSearch]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadData(); }, [loadData]);

  if (isLoading) return <PageLoader label="Loading inventory..." />;
  if (loadError) return <ErrorState message={loadError} onRetry={loadData} />;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Inventory (All Sellers)</h1>

      <Card className="flex gap-3">
        <Input placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="flex-1" />
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} options={STATUS_OPTIONS} />
      </Card>

      <Card>
        {items.length === 0 ? (
          <EmptyState title="No inventory" message="No inventory records match your filters." />
        ) : (
          <>
            <AdminInventoryTable
              items={items}
              onAdjust={(inv) => { setSelectedItem(inv); adjustModal.open(); }}
              onHistory={(inv) => { setSelectedItem(inv); historyModal.open(); }}
            />
            <div className="mt-4"><Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} /></div>
          </>
        )}
      </Card>

      <AdminAdjustModal isOpen={adjustModal.isOpen} onClose={adjustModal.close} inventoryItem={selectedItem} onSaved={loadData} />
      <StockHistoryModal isOpen={historyModal.isOpen} onClose={historyModal.close} inventoryItem={selectedItem} />
    </div>
  );
}

export default function AdminInventoryPage() {
  return (
    <AdminLayout>
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <AdminInventoryContent />
      </ProtectedRoute>
    </AdminLayout>
  );
}