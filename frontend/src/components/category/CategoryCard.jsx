import Link from 'next/link';
import { resolveImageSrc } from '@/utils/imageHelpers';

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 text-center transition-shadow hover:shadow-card dark:border-gray-800"
    >
      <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        {category.image || category.icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolveImageSrc(category.image || category.icon)}
            alt={category.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-gray-400">
            {category.name?.[0]}
          </div>
        )}
      </div>
      <span className="text-sm font-medium group-hover:text-primary-600">{category.name}</span>
    </Link>
  );
}