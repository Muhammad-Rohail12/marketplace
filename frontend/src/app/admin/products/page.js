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
import ProductTable from '@/components/admin/products/ProductTable';
import ProductReviewModal from '@/components/admin/products/ProductReviewModal';
import { productService } from '@/services/productService';
import { useDebounce } from '@/hooks/useDebounce';
import { useModal } from '@/hooks/useModal';
import { ROLES } from '@/constants/roles';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'PENDING_REVIEW', label: 'Pending Review' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ARCHIVED', label: 'Archived' },
  { value: 'DRAFT', label: 'Draft' },
];

function AdminProductsContent() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('PENDING_REVIEW');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const reviewModal = useModal(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await productService.listAll({ page, limit: 20, status, search: debouncedSearch });
      setProducts(res.data.products);
      setMeta(res.meta);
    } catch (err) {
      setLoadError(err.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [page, status, debouncedSearch]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadData(); }, [loadData]);

  const handleView = async (p) => {
    const res = await productService.get(p.id);
    setSelectedProduct(res.data.product);
    reviewModal.open();
  };

  const handleChanged = (updated) => {
    setSelectedProduct(updated);
    loadData();
  };

  if (isLoading) return <PageLoader label="Loading products..." />;
  if (loadError) return <ErrorState message={loadError} onRetry={loadData} />;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Product Review</h1>

      <Card className="flex gap-3">
        <Input placeholder="Search by name..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="flex-1" />
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} options={STATUS_OPTIONS} />
      </Card>

      <Card>
        {products.length === 0 ? (
          <EmptyState title="No products" message="No products match your filters." />
        ) : (
          <>
            <ProductTable products={products} onView={handleView} />
            <div className="mt-4"><Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} /></div>
          </>
        )}
      </Card>

      <ProductReviewModal isOpen={reviewModal.isOpen} onClose={reviewModal.close} product={selectedProduct} onChanged={handleChanged} />
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <AdminLayout>
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <AdminProductsContent />
      </ProtectedRoute>
    </AdminLayout>
  );
}