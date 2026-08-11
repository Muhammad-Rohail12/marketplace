'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import SellerLayout from '@/components/layout/SellerLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import PageLoader from '@/components/feedback/PageLoader';
import EmptyState from '@/components/feedback/EmptyState';
import ErrorState from '@/components/feedback/ErrorState';
import SellerProductTable from '@/components/seller/products/SellerProductTable';
import { productService } from '@/services/productService';
import { useDebounce } from '@/hooks/useDebounce';
import { ROLES } from '@/constants/roles';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PENDING_REVIEW', label: 'Pending Review' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ARCHIVED', label: 'Archived' },
];

function SellerProductsContent() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await productService.listMine({ page, limit: 20, status, search: debouncedSearch });
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

  const handleDuplicate = async (p) => {
    await productService.duplicate(p.id);
    loadData();
  };
  const handleArchive = async (p) => {
    if (!window.confirm(`Archive "${p.name}"?`)) return;
    await productService.archive(p.id);
    loadData();
  };

  if (isLoading) return <PageLoader label="Loading products..." />;
  if (loadError) return <ErrorState message={loadError} onRetry={loadData} />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Products</h1>
        <Link href="/seller/products/new"><Button>+ New Product</Button></Link>
      </div>

      <Card className="flex gap-3">
        <Input placeholder="Search products..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="flex-1" />
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} options={STATUS_OPTIONS} />
      </Card>

      <Card>
        {products.length === 0 ? (
          <EmptyState title="No products yet" message="Create your first product to get started." />
        ) : (
          <>
            <SellerProductTable products={products} onDuplicate={handleDuplicate} onArchive={handleArchive} />
            <div className="mt-4"><Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} /></div>
          </>
        )}
      </Card>
    </div>
  );
}

export default function SellerProductsPage() {
  return (
    <SellerLayout>
      <ProtectedRoute allowedRoles={[ROLES.SELLER]}>
        <SellerProductsContent />
      </ProtectedRoute>
    </SellerLayout>
  );
}