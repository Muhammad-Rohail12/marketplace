import { resolveImageSrc } from '@/utils/imageHelpers';

export default function BrandLogo({ brand, size = 48, className = '' }) {
  if (!brand?.logo) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center rounded-md bg-gray-100 text-sm font-semibold text-gray-400 dark:bg-gray-800 ${className}`}
      >
        {brand?.name?.[0] || '?'}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolveImageSrc(brand.logo)}
      alt={brand.name}
      style={{ width: size, height: size }}
      className={`rounded-md object-contain ${className}`}
    />
  );
}