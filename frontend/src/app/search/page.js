'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import PageLoader from '@/components/feedback/PageLoader';
import EmptyState from '@/components/feedback/EmptyState';
import ProductGrid from '@/components/product/ProductGrid';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import CategorySidebarFilters from '@/components/category/CategorySidebarFilters';
import MobileFilterDrawer from '@/components/category/MobileFilterDrawer';
import ActiveFilterChips from '@/components/category/ActiveFilterChips';
import { productService } from '@/services/productService';
import { applyClientFilters, deriveBrandOptions, derivePriceBounds } from '@/utils/productListFilters';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { useModal } from '@/hooks/useModal';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Best Match' },
  { value: 'createdAt:desc', label: 'Newest' },
  { value: 'name:asc', label: 'Name: A to Z' },
];

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { filters, setFilters, clearAll } = useUrlFilters({ sort: 'relevance', page: 1, brands: [] });

  const [rawProducts, setRawProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, totalCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const mobileFilters = useModal(false);

  const page = filters.page || 1;
  const sort = filters.sort || 'relevance';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const selectedBrandIds = filters.brands || [];
  const priceMinParam = filters.priceMin;
  const priceMaxParam = filters.priceMax;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    productService.listAll({
      search: query, page, limit: 24,
      sort: sort === 'relevance' ? undefined : sort,
    }).then((res) => {
      setRawProducts(res.data.products || []);
      setMeta(res.meta || { page: 1, totalPages: 1, totalCount: (res.data.products || []).length });
    }).finally(() => setIsLoading(false));
  }, [query, page, sort]);

  const priceBounds = useMemo(() => derivePriceBounds(rawProducts), [rawProducts]);
  const priceRange = useMemo(() => [
    priceMinParam !== undefined ? Number(priceMinParam) : priceBounds.min,
    priceMaxParam !== undefined ? Number(priceMaxParam) : priceBounds.max,
  ], [priceMinParam, priceMaxParam, priceBounds]);

  const filteredProducts = useMemo(
    () => applyClientFilters(rawProducts, { brandIds: selectedBrandIds, priceMin: priceRange[0], priceMax: priceRange[1] }),
    [rawProducts, selectedBrandIds, priceRange]
  );
  const availableBrands = useMemo(() => deriveBrandOptions(rawProducts), [rawProducts]);
  const selectedBrandObjects = availableBrands.filter((b) => selectedBrandIds.includes(b.id));

  const handleToggleBrand = (brandId) => {
    const next = selectedBrandIds.includes(brandId) ? selectedBrandIds.filter((id) => id !== brandId) : [...selectedBrandIds, brandId];
    setFilters({ brands: next });
  };
  const handlePriceChange = ([min, max]) => setFilters({ priceMin: min, priceMax: max });
  const handleResetPrice = () => setFilters({ priceMin: undefined, priceMax: undefined });
  const handleClearAll = () => clearAll(['q']);

  const filterProps = {
    subcategories: [],
    brands: availableBrands,
    selectedBrandIds,
    onToggleBrand: handleToggleBrand,
    priceRange, priceBounds,
    onPriceChange: handlePriceChange,
    onClearAll: handleClearAll,
  };

  return (
    <div className="container-page flex flex-col gap-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-neutral-200 pb-4 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-semibold">{query ? <>Results for &ldquo;{query}&rdquo;</> : 'Search'}</h1>
          {!isLoading && <p className="mt-1 text-sm text-neutral-500">{filteredProducts.length} results</p>}
        </div>
        <Select id="search-sort" value={sort} onChange={(e) => setFilters({ sort: e.target.value })} options={SORT_OPTIONS} />
      </div>

      <ActiveFilterChips
        selectedBrands={selectedBrandObjects}
        priceRange={priceRange}
        priceBounds={priceBounds}
        onRemoveBrand={handleToggleBrand}
        onResetPrice={handleResetPrice}
        onClearAll={handleClearAll}
      />

      <div className="flex items-center justify-between lg:hidden">
        <MobileFilterDrawer
          isOpen={mobileFilters.isOpen}
          onOpen={mobileFilters.open}
          onClose={mobileFilters.close}
          resultCount={filteredProducts.length}
          activeCount={selectedBrandIds.length + (priceRange[0] > priceBounds.min || priceRange[1] < priceBounds.max ? 1 : 0)}
          {...filterProps}
        />
      </div>

      {isLoading ? (
        <PageLoader label="Searching..." />
      ) : filteredProducts.length === 0 ? (
        <EmptyState title="No results found" message={query ? `We couldn't find anything matching "${query}". Try different keywords.` : 'Enter a search term to get started.'} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <CategorySidebarFilters {...filterProps} />
          </aside>
          <div className="flex flex-col gap-4">
            <ProductGrid products={filteredProducts} />
            <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={(p) => setFilters({ page: p }, { resetPage: false })} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <MainLayout>
      <Suspense fallback={<PageLoader label="Loading search..." />}>
        <SearchResults />
      </Suspense>
    </MainLayout>
  );
}