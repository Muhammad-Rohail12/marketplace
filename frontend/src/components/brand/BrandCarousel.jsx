import BrandCard from './BrandCard';

export default function BrandCarousel({ brands = [], title }) {
  if (!brands.length) return null;

  return (
    <section className="flex flex-col gap-3">
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {brands.map((brand) => (
          <div key={brand.id} className="w-32 shrink-0">
            <BrandCard brand={brand} />
          </div>
        ))}
      </div>
    </section>
  );
}