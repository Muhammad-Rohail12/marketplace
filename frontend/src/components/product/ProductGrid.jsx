import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import EmptyState from '@/components/feedback/EmptyState';

export default function ProductGrid({ products = [], isLoading = false, skeletonCount = 10 }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: skeletonCount }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!products.length) return <EmptyState title="No products" message="Check back soon." />;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}