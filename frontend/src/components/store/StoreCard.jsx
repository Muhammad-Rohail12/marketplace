import Link from 'next/link';
import StoreLogo from './StoreLogo';

export default function StoreCard({ store }) {
  return (
    <Link
      href={`/store/${store.slug}`}
      className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 text-center transition-shadow hover:shadow-card dark:border-gray-800"
    >
      <StoreLogo store={store} size={56} />
      <span className="text-sm font-medium">{store.name}</span>
      {store.shortDescription && <span className="text-xs text-gray-500 line-clamp-2">{store.shortDescription}</span>}
    </Link>
  );
}