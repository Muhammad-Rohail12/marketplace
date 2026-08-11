'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Pagination from '@/components/ui/Pagination';
import PageLoader from '@/components/feedback/PageLoader';
import EmptyState from '@/components/feedback/EmptyState';
import ErrorState from '@/components/feedback/ErrorState';
import BrandTable from '@/components/admin/brands/BrandTable';
import BrandFormModal from '@/components/admin/brands/BrandFormModal';
import { listBrands, deleteBrand, restoreBrand } from '@/services/brandService';
import { useModal } from '@/hooks/useModal';
import { useDebounce } from '@/hooks/useDebounce';
import { ROLES } from '@/constants/roles';

function AdminBrandsContent() {
  const [brands, setBrands] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editingBrand, setEditingBrand] = useState(null);
  const formModal = useModal(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await listBrands({
        page,
        limit: 20,
        search: debouncedSearch,
        includeInactive: 'true',
        includeDeleted: 'true',
        sort: 'displayOrder:asc',
      });
      setBrands(res.data.brands);
      setMeta(res.meta);
    } catch (err) {
      console.error('Failed to load brands:', err);
      setLoadError(err.message || 'Failed to load brands');
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const handleCreate = () => {
    setEditingBrand(null);
    formModal.open();
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    formModal.open();
  };

  const handleDelete = async (brand) => {
    if (!window.confirm(`Delete "${brand.name}"?`)) return;
    await deleteBrand(brand.id);
    loadData();
  };

  const handleRestore = async (brand) => {
    await restoreBrand(brand.id);
    loadData();
  };

  if (isLoading) return <PageLoader label="Loading brands..." />;

  if (loadError) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Brand Management</h1>
        <ErrorState message={loadError} onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Brand Management</h1>
        <Button onClick={handleCreate}>+ New Brand</Button>
      </div>

      <Card>
        <Input
          id="brand-search"
          placeholder="Search brands..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </Card>

      <Card>
        {brands.length === 0 ? (
          <EmptyState title="No brands yet" message="Create your first brand to get started." />
        ) : (
          <>
            <BrandTable brands={brands} onEdit={handleEdit} onDelete={handleDelete} onRestore={handleRestore} />
            <div className="mt-4">
              <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </Card>

      <BrandFormModal isOpen={formModal.isOpen} onClose={formModal.close} brand={editingBrand} onSaved={loadData} />
    </div>
  );
}

export default function AdminBrandsPage() {
  return (
    <AdminLayout>
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <AdminBrandsContent />
      </ProtectedRoute>
    </AdminLayout>
  );
}