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
import StoreTable from '@/components/admin/stores/StoreTable';
import StorePreview from '@/components/store/StorePreview';
import Modal from '@/components/ui/Modal';
import { storeService } from '@/services/storeService';
import { useDebounce } from '@/hooks/useDebounce';
import { useModal } from '@/hooks/useModal';
import { ROLES } from '@/constants/roles';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'CLOSED', label: 'Closed' },
];

function AdminStoresContent() {
  const [stores, setStores] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const previewModal = useModal(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await storeService.list({ page, limit: 20, status, search: debouncedSearch });
      setStores(res.data.stores);
      setMeta(res.meta);
    } catch (err) {
      setLoadError(err.message || 'Failed to load stores');
    } finally {
      setIsLoading(false);
    }
  }, [page, status, debouncedSearch]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadData(); }, [loadData]);

  const handleView = async (store) => {
    const res = await storeService.get(store.id);
    setSelectedStore(res.data.store);
    previewModal.open();
  };

  const handleSuspend = async (store) => {
    if (!window.confirm(`Suspend "${store.name}"?`)) return;
    await storeService.suspend(store.id);
    loadData();
  };

  const handleActivate = async (store) => {
    await storeService.activate(store.id);
    loadData();
  };

  const handleFeature = async (store) => {
    await storeService.feature(store.id, !store.isFeatured);
    loadData();
  };

  if (isLoading) return <PageLoader label="Loading stores..." />;

  if (loadError) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Store Management</h1>
        <ErrorState message={loadError} onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Store Management</h1>

      <Card className="flex gap-3">
        <Input
          id="store-search"
          placeholder="Search by store name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1"
        />
        <Select id="store-status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} options={STATUS_OPTIONS} />
      </Card>

      <Card>
        {stores.length === 0 ? (
          <EmptyState title="No stores" message="No stores match your filters." />
        ) : (
          <>
            <StoreTable stores={stores} onView={handleView} onSuspend={handleSuspend} onActivate={handleActivate} onFeature={handleFeature} />
            <div className="mt-4">
              <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </Card>

      <Modal isOpen={previewModal.isOpen} onClose={previewModal.close} title="Store Preview" className="max-w-3xl">
        {selectedStore && (
          <div className="max-h-[70vh] overflow-y-auto">
            <StorePreview store={selectedStore} />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function AdminStoresPage() {
  return (
    <AdminLayout>
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <AdminStoresContent />
      </ProtectedRoute>
    </AdminLayout>
  );
}