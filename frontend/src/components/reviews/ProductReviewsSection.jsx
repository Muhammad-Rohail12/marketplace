'use client';

import { useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/feedback/EmptyState';
import ReviewRatingSummary from './ReviewRatingSummary';
import CustomerPhotosStrip from './CustomerPhotosStrip';
import ReviewControls from './ReviewControls';
import ReviewFilterChips from './ReviewFilterChips';
import ReviewCard from './ReviewCard';
import WriteReviewModal from './WriteReviewModal';
import { getReviewStatistics, filterReviews, sortReviews } from '@/utils/reviewUtils';
import { useModal } from '@/hooks/useModal';
import { reviewService } from '@/services/reviewService';

const PAGE_SIZE = 5;
const DEFAULT_FILTERS = { ratingFilter: null, withPhotos: false, verifiedOnly: false, searchQuery: '' };

// Reviews are mock data throughout this section only (Phase 42's
// explicit, authorized scope) — nowhere else in the app (ProductCard,
// ProductInfoHeader, category listings) references this mock dataset,
// preserving the "only show real rating data" boundary those
// components established in Phase 37/40/41.
export default function ProductReviewsSection({ productId, productName }) {
  const [allReviews, setAllReviews] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState('most-helpful');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const writeReview = useModal(false);

  useEffect(() => {
    let mounted = true;
    reviewService.listByProduct(productId).then((response) => {
      if (mounted) setAllReviews(response.data.reviews || []);
    }).catch(() => {
      if (mounted) setAllReviews([]);
    });
    return () => { mounted = false; };
  }, [productId]);

  const stats = useMemo(() => getReviewStatistics(allReviews), [allReviews]);
  const filtered = useMemo(() => filterReviews(allReviews, filters), [allReviews, filters]);
  const sorted = useMemo(() => sortReviews(filtered, sortBy), [filtered, sortBy]);
  const visible = sorted.slice(0, visibleCount);

  const handleFilterChange = (update) => {
    setFilters((prev) => ({ ...prev, ...update }));
    setVisibleCount(PAGE_SIZE);
  };
  const handleClearAll = () => { setFilters(DEFAULT_FILTERS); setVisibleCount(PAGE_SIZE); };
  const handleFilterByStar = (star) => handleFilterChange({ ratingFilter: filters.ratingFilter === star ? null : star });

  return (
    <section id="reviews" className="flex flex-col gap-6 scroll-mt-20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Customer Reviews</h2>
        <Button size="sm" onClick={writeReview.open}>Write a Review</Button>
      </div>

      <ReviewRatingSummary stats={stats} onFilterByStar={handleFilterByStar} />

      <CustomerPhotosStrip reviews={allReviews} />

      {allReviews.length === 0 ? (
        <EmptyState title="No reviews yet" message="Be the first to share your experience with this product." />
      ) : (
        <>
          <ReviewControls filters={filters} onFilterChange={handleFilterChange} sortBy={sortBy} onSortChange={setSortBy} />
          <ReviewFilterChips filters={filters} onFilterChange={handleFilterChange} onClearAll={handleClearAll} />

          {sorted.length === 0 ? (
            <EmptyState title="No reviews match your filters" message="Try adjusting or clearing your filters." />
          ) : (
            <>
              <p className="text-xs text-neutral-400">Showing {visible.length} of {sorted.length} reviews</p>
              <div className="flex flex-col">
                {visible.map((review) => <ReviewCard key={review.id} review={review} />)}
              </div>
              {visibleCount < sorted.length ? (
                <Button variant="outline" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} className="self-center">
                  Load More Reviews
                </Button>
              ) : (
                <p className="text-center text-xs text-neutral-400">No more reviews</p>
              )}
            </>
          )}
        </>
      )}

      <WriteReviewModal isOpen={writeReview.isOpen} onClose={writeReview.close} productId={productId} productName={productName} onSubmitted={() => reviewService.listByProduct(productId).then((response) => setAllReviews(response.data.reviews || []))} />
    </section>
  );
}