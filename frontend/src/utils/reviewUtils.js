// Pure data functions — kept separate from presentation per the
// roadmap's explicit "filterReviews()/sortReviews()/getReviewStatistics()
// not inside JSX" requirement.

export function getReviewStatistics(reviews = []) {
  const total = reviews.length;
  if (total === 0) {
    return { average: 0, total: 0, distribution: [5, 4, 3, 2, 1].map((star) => ({ star, count: 0, percentage: 0 })), verifiedCount: 0, photoCount: 0 };
  }

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const average = Math.round((sum / total) * 10) / 10; // one decimal, e.g. 4.7

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return { star, count, percentage: Math.round((count / total) * 100) };
  });

  const verifiedCount = reviews.filter((r) => r.isVerifiedPurchase).length;
  const photoCount = reviews.filter((r) => r.images?.length > 0).length;

  return { average, total, distribution, verifiedCount, photoCount };
}

export function filterReviews(reviews, { ratingFilter, withPhotos, verifiedOnly, searchQuery } = {}) {
  return reviews.filter((r) => {
    if (ratingFilter && r.rating < ratingFilter) return false;
    if (withPhotos && (!r.images || r.images.length === 0)) return false;
    if (verifiedOnly && !r.isVerifiedPurchase) return false;
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const haystack = `${r.title || ''} ${r.body || ''}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function sortReviews(reviews, sortBy = 'most-helpful') {
  const copy = [...reviews];
  switch (sortBy) {
    case 'most-recent':
      return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'highest-rated':
      return copy.sort((a, b) => b.rating - a.rating || b.helpfulCount - a.helpfulCount);
    case 'lowest-rated':
      return copy.sort((a, b) => a.rating - b.rating || b.helpfulCount - a.helpfulCount);
    case 'with-photos':
      return copy.sort((a, b) => (b.images?.length || 0) - (a.images?.length || 0));
    case 'most-helpful':
    default:
      return copy.sort((a, b) => b.helpfulCount - a.helpfulCount);
  }
}

export function formatReviewDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  return `Reviewed on ${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
}