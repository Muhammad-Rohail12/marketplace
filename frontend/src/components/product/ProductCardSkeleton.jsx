import Skeleton from '@/components/ui/Skeleton';

// Single skeleton shape reused by every product-grid/rail loading
// state (Phase 35's rails previously used ad-hoc <Skeleton> sizing
// per call site — this consolidates that into one component).
export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-full rounded-md" />
    </div>
  );
}