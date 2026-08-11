import CategoryCard from './CategoryCard';

// Foundation horizontal-scroll layout — a real carousel (arrows,
// auto-scroll, drag) can replace the inner markup later without
// changing how callers use this component.
export default function CategoryCarousel({ categories = [], title }) {
  if (!categories.length) return null;

  return (
    <section className="flex flex-col gap-3">
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {categories.map((category) => (
          <div key={category.id} className="w-28 shrink-0">
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
    </section>
  );
}