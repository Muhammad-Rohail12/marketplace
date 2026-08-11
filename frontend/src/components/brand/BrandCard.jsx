import Link from 'next/link';
import BrandLogo from './BrandLogo';
import BrandBadge from './BrandBadge';

export default function BrandCard({ brand }) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 text-center transition-shadow hover:shadow-card dark:border-gray-800"
    >
      <BrandLogo brand={brand} size={56} />
      <span className="text-sm font-medium">{brand.name}</span>
      <BrandBadge brand={brand} />
    </Link>
  );
}