import CategoryCard from './CategoryCard';
import EmptyState from '@/components/feedback/EmptyState';

export default function CategoryGrid({ categories = [] }) {
  if (!categories.length) return <EmptyState title="No categories" message="Check back soon." />;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}