import Link from 'next/link';

// Static promotional tiles — same "no Banner backend yet" documented
// placeholder pattern as HeroSlider. Represents the roadmap's
// "Advertising products / Promotions / Promotional overlays" header requirement.
const TILES = [
  { id: 'tile-1', title: 'Top Brands, Better Prices', subtitle: 'Explore trusted names', href: '/brands', image: null, tone: 'bg-primary-50 dark:bg-primary-500/10' },
  { id: 'tile-2', title: 'Fresh Arrivals Weekly', subtitle: 'New styles just landed', href: '/products?sort=createdAt:desc', image: null, tone: 'bg-secondary-50 dark:bg-secondary-500/10' },
];

export default function PromoTilesGrid() {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      {TILES.map((tile) => (
        <Link
          key={tile.id}
          href={tile.href}
          prefetch={false}
          className={`group flex items-center justify-between rounded-xl p-6 transition-shadow hover:shadow-elevated ${tile.tone}`}
        >
          <div>
            <p className="text-xs font-medium uppercase text-neutral-500">{tile.subtitle}</p>
            <h3 className="mt-1 text-xl font-semibold">{tile.title}</h3>
            <span className="mt-3 inline-block text-sm font-medium text-primary-600 group-hover:underline">Shop now →</span>
          </div>
        </Link>
      ))}
    </section>
  );
}