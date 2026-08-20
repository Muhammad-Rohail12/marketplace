import Skeleton from '@/components/ui/Skeleton';

export default function ProductLoading() {
  return (
    <div className="container-page flex flex-col gap-6 py-6">
      <Skeleton className="h-4 w-64" />
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr_320px]">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  );
}