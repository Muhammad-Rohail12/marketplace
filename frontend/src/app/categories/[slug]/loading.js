import Skeleton from '@/components/ui/Skeleton';
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton';

export default function CategoryLoading() {
  return (
    <div className="container-page flex flex-col gap-4 py-6">
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <Skeleton className="hidden h-96 w-full rounded-lg lg:block" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );
}