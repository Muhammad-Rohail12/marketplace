import ProductCard from './ProductCard';
import EmptyState from '@/components/feedback/EmptyState';

export default function ProductGrid({ products = [] }) {
  if (!products.length) return <EmptyState title="No products" message="Check back soon." />;
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}