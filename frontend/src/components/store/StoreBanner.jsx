import { resolveImageSrc } from '@/utils/imageHelpers';

export default function StoreBanner({ store, className = '' }) {
  if (!store?.banner) {
    return <div className={`h-40 w-full bg-gradient-to-r from-primary-100 to-primary-50 dark:from-gray-800 dark:to-gray-900 ${className}`} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={resolveImageSrc(store.banner)} alt="" className={`h-40 w-full object-cover ${className}`} />
  );
}