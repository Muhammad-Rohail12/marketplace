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
import ApplicationTable from '@/components/admin/sellers/ApplicationTable';
import ApplicationDetailModal from '@/components/admin/sellers/ApplicationDetailModal';
import { sellerApplicationService } from '@/services/sellerApplicationService';
import { useModal } from '@/hooks/useModal';
import { useDebounce } from '@/hooks/useDebounce';
import { ROLES } from '@/constants/roles';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

function AdminSellersContent() {
  const [applications, setApplications] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const detailModal = useModal(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await sellerApplicationService.list({ page, limit: 20, status, search: debouncedSearch });
      setApplications(res.data.applications);
      setMeta(res.meta);
    } catch (err) {
      setLoadError(err.message || 'Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  }, [page, status, debouncedSearch]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadData(); }, [loadData]);

  const handleView = async (app) => {
    const res = await sellerApplicationService.get(app.id);
    setSelectedApp(res.data.application);
    detailModal.open();
  };

  const handleChanged = (updatedApp) => {
    setSelectedApp(updatedApp);
    loadData();
  };

  if (isLoading) return <PageLoader label="Loading applications..." />;

  if (loadError) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Seller Applications</h1>
        <ErrorState message={loadError} onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Seller Applications</h1>

      <Card className="flex gap-3">
        <Input
          id="app-search"
          placeholder="Search by business name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1"
        />
        <Select
          id="app-status"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          options={STATUS_OPTIONS}
        />
      </Card>

      <Card>
        {applications.length === 0 ? (
          <EmptyState title="No applications" message="No seller applications match your filters." />
        ) : (
          <>
            <ApplicationTable applications={applications} onView={handleView} />
            <div className="mt-4">
              <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </Card>

      <ApplicationDetailModal
        isOpen={detailModal.isOpen}
        onClose={detailModal.close}
        application={selectedApp}
        onChanged={handleChanged}
      />
    </div>
  );
}

export default function AdminSellersPage() {
  return (
    <AdminLayout>
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <AdminSellersContent />
      </ProtectedRoute>
    </AdminLayout>
  );
}