import BrandCard from './BrandCard';
import EmptyState from '@/components/feedback/EmptyState';

export default function BrandGrid({ brands = [] }) {
  if (!brands.length) return <EmptyState title="No brands" message="Check back soon." />;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {brands.map((brand) => (
        <BrandCard key={brand.id} brand={brand} />
      ))}
    </div>
  );
}