import Link from 'next/link';
import Badge from '@/components/ui/Badge';

// Rating/sales-count intentionally NOT rendered here — no Review or
// Order-aggregation backend is publicly exposed yet (flagged since
// Phase 37). Showing that line only once product.rating is real data
// on the API response, exactly like ProductCard already does.
export default function ProductInfoHeader({ product }) {
  return (
    <div className="flex flex-col gap-2">
      {product.brand && (
        <Link href={`/brands/${product.brand.slug}`} className="text-sm font-medium text-primary-600 hover:underline">
          {product.brand.name}
        </Link>
      )}
      <h1 className="text-2xl font-semibold leading-snug text-balance">{product.name}</h1>

      <div className="flex flex-wrap gap-2">
        {product.condition && product.condition !== 'NEW' && <Badge variant="warning">{product.condition}</Badge>}
        {product.manufacturer && <span className="text-xs text-neutral-500">Manufacturer: {product.manufacturer}</span>}
        {product.modelNumber && <span className="text-xs text-neutral-500">Model: {product.modelNumber}</span>}
      </div>

      {product.shortDescription && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{product.shortDescription}</p>
      )}
    </div>
  );
}