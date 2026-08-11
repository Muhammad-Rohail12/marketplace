import { resolveImageSrc } from '@/utils/imageHelpers';

export default function StoreLogo({ store, size = 64, className = '' }) {
  if (!store?.logo) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-gray-400 dark:bg-gray-800 ${className}`}
      >
        {store?.name?.[0] || '?'}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolveImageSrc(store.logo)}
      alt={store.name}
      style={{ width: size, height: size }}
      className={`rounded-full object-cover ${className}`}
    />
  );
}