import PageLoader from '@/components/feedback/PageLoader';

// Root-level fallback shown during navigation before a page's own
// data-fetching resolves — Next.js App Router convention, automatic.
export default function Loading() {
  return <PageLoader label="Loading..." />;
}