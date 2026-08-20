'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import ProductGrid from '@/components/product/ProductGrid';
import Pagination from '@/components/ui/Pagination';
import PageLoader from '@/components/feedback/PageLoader';
import EmptyState from '@/components/feedback/EmptyState';
import CategorySidebarFilters from '@/components/category/CategorySidebarFilters';
import CategoryListingHeader from '@/components/category/CategoryListingHeader';
import MobileFilterDrawer from '@/components/category/MobileFilterDrawer';
import ActiveFilterChips from '@/components/category/ActiveFilterChips';
import { getCategoryBySlug, getCategoryBreadcrumb, getCategoryChildren } from '@/services/categoryService';
import { productService } from '@/services/productService';
import { applyClientFilters, deriveBrandOptions, derivePriceBounds } from '@/utils/productListFilters';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { useModal } from '@/hooks/useModal';
import { ROUTES } from '@/constants/routes';

function CategoryListingContent() {
  const { slug } = useParams();
  const { filters, setFilters, clearAll } = useUrlFilters({ sort: 'createdAt:desc', page: 1, brands: [] });

  const [category, setCategory] = useState(null);
  const [ancestors, setAncestors] = useState([]);
  const [children, setChildren] = useState([]);
  const [rawProducts, setRawProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, totalCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const mobileFilters = useModal(false);

  const page = filters.page || 1;
  const sort = filters.sort || 'createdAt:desc';
 
  const selectedBrandIds = filters.brands || [];
  const priceMinParam = filters.priceMin;
  const priceMaxParam = filters.priceMax;

  useEffect(() => {
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setNotFound(false);

    if (!slug) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    getCategoryBySlug(slug)
      .then(async (res) => {
        const cat = res?.data?.category;
        if (!cat) {
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        setCategory(cat);

        const [breadcrumbRes, childrenRes, productsRes] = await Promise.allSettled([
          getCategoryBreadcrumb(cat.id),
          getCategoryChildren(cat.id),
          productService.listByCategory(cat.id, { page, limit: 24, sort }),
        ]);

        const breadcrumbData = breadcrumbRes.status === 'fulfilled' ? breadcrumbRes.value?.data?.breadcrumb || [] : [];
        const childrenData = childrenRes.status === 'fulfilled' ? childrenRes.value?.data?.children || [] : [];
        const productsData = productsRes.status === 'fulfilled' ? productsRes.value : { data: { products: [] }, meta: { page: 1, totalPages: 1, totalCount: 0 } };

        setAncestors(breadcrumbData.slice(0, -1));
        setChildren(childrenData);
        setRawProducts(productsData.data.products || []);
        setMeta(productsData.meta || { page: 1, totalPages: 1, totalCount: (productsData.data.products || []).length });
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [slug, page, sort]);

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
  const handleClearAll = () => clearAll();

  if (isLoading && !category) return <MainLayout><PageLoader label="Loading category..." /></MainLayout>;
  if (notFound) return <MainLayout><div className="container-page py-16"><EmptyState title="Category not found" message="This category may have been moved or removed." /></div></MainLayout>;
  if (!category) return null;

  const breadcrumbItems = [
    { label: 'Home', href: ROUTES.HOME },
    ...ancestors.map((a) => ({ label: a.name, href: `/categories/${a.slug}` })),
    { label: category.name },
  ];

  const filterProps = {
    subcategories: children,
    activeSubcategorySlug: slug,
    brands: availableBrands,
    selectedBrandIds,
    onToggleBrand: handleToggleBrand,
    priceRange, priceBounds,
    onPriceChange: handlePriceChange,
    onClearAll: handleClearAll,
  };

  return (
    <MainLayout>
      <div className="container-page flex flex-col gap-4 py-6">
        <Breadcrumb items={breadcrumbItems} />

        <CategoryListingHeader category={category} count={filteredProducts.length} sort={sort} onSortChange={(v) => setFilters({ sort: v })} />

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

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <CategorySidebarFilters {...filterProps} />
          </aside>

          <div className="flex flex-col gap-4">
            <ProductGrid products={filteredProducts} isLoading={isLoading} />
            <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={(p) => setFilters({ page: p }, { resetPage: false })} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default function CategoryListingPage() {
  return (
    <Suspense fallback={<MainLayout><PageLoader label="Loading category..." /></MainLayout>}>
      <CategoryListingContent />
    </Suspense>
  );
}