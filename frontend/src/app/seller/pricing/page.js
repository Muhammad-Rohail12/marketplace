'use client';

import { useCallback, useEffect, useState } from 'react';
import SellerLayout from '@/components/layout/SellerLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Pagination from '@/components/ui/Pagination';
import PageLoader from '@/components/feedback/PageLoader';
import EmptyState from '@/components/feedback/EmptyState';
import ErrorState from '@/components/feedback/ErrorState';
import PricingTable from '@/components/seller/pricing/PricingTable';
import PriceFormModal from '@/components/seller/pricing/PriceFormModal';
import DiscountFormModal from '@/components/seller/pricing/DiscountFormModal';
import PriceHistoryModal from '@/components/seller/pricing/PriceHistoryModal';
import { pricingService } from '@/services/pricingService';
import { useDebounce } from '@/hooks/useDebounce';
import { useModal } from '@/hooks/useModal';
import { ROLES } from '@/constants/roles';

function SellerPricingContent() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const priceModal = useModal(false);
  const discountModal = useModal(false);
  const historyModal = useModal(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await pricingService.listMine({ page, limit: 20, search: debouncedSearch });
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
      <h1 className="text-2xl font-semibold">Pricing</h1>
      <p className="text-sm text-gray-500">
        To set up pricing for a new product, open the product&apos;s edit page — the price form will appear once inventory is tracked.
      </p>

      <Card>
        <Input placeholder="Search products..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </Card>

      <Card>
        {items.length === 0 ? (
          <EmptyState title="No pricing set up yet" message="Set prices from your product edit pages." />
        ) : (
          <>
            <PricingTable
              items={items}
              onEdit={(p) => { setSelectedItem(p); priceModal.open(); }}
              onDiscount={(p) => { setSelectedItem(p); discountModal.open(); }}
              onHistory={(p) => { setSelectedItem(p); historyModal.open(); }}
            />
            <div className="mt-4"><Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} /></div>
          </>
        )}
      </Card>

      <PriceFormModal isOpen={priceModal.isOpen} onClose={priceModal.close} priceItem={selectedItem} onSaved={loadData} />
      <DiscountFormModal isOpen={discountModal.isOpen} onClose={discountModal.close} priceItem={selectedItem} onSaved={loadData} />
      <PriceHistoryModal isOpen={historyModal.isOpen} onClose={historyModal.close} priceItem={selectedItem} />
    </div>
  );
}

export default function SellerPricingPage() {
  return (
    <SellerLayout>
      <ProtectedRoute allowedRoles={[ROLES.SELLER]}>
        <SellerPricingContent />
      </ProtectedRoute>
    </SellerLayout>
  );
}