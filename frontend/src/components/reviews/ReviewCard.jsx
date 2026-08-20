'use client';

import { useState } from 'react';
import { FiThumbsUp, FiCheckCircle } from 'react-icons/fi';
import Rating from '@/components/ui/Rating';
import Badge from '@/components/ui/Badge';
import { formatReviewDate } from '@/utils/reviewUtils';
import ReviewImageLightbox from './ReviewImageLightbox';

const BODY_TRUNCATE_LENGTH = 280;

export default function ReviewCard({ review }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [hasMarkedHelpful, setHasMarkedHelpful] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const isLong = review.body.length > BODY_TRUNCATE_LENGTH;
  const displayBody = isLong && !isExpanded ? `${review.body.slice(0, BODY_TRUNCATE_LENGTH)}...` : review.body;

  const handleHelpful = () => {
    if (hasMarkedHelpful) return; // local-only, prevents double-count in this session
    setHelpfulCount((c) => c + 1);
    setHasMarkedHelpful(true);
  };

  return (
    <article className="flex flex-col gap-2 border-b border-neutral-100 py-5 dark:border-neutral-900">
      <div className="flex items-center gap-2">
        <Rating value={review.rating} showCount={false} size={14} />
        {review.isVerifiedPurchase && (
          <Badge variant="success" className="flex items-center gap-1">
            <FiCheckCircle size={11} /> Verified Purchase
          </Badge>
        )}
      </div>

      {review.title && <h3 className="text-sm font-semibold">{review.title}</h3>}

      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <span>{review.reviewerName}</span>
        <span aria-hidden="true">·</span>
        <span>{formatReviewDate(review.createdAt)}</span>
      </div>

      {review.variant && <p className="text-xs text-neutral-400">Purchased: {review.variant}</p>}

      <p className="text-sm text-neutral-700 dark:text-neutral-300">
        {displayBody}
        {isLong && (
          <button type="button" onClick={() => setIsExpanded((p) => !p)} className="ml-1 font-medium text-primary-600 hover:underline">
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </p>

      {review.images?.length > 0 && (
        <div className="flex gap-2">
          {review.images.map((img, i) => (
            <button key={i} type="button" onClick={() => setLightboxIndex(i)} className="h-16 w-16 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`Customer photo ${i + 1} for review "${review.title}"`} className="h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleHelpful}
        aria-pressed={hasMarkedHelpful}
        className="mt-1 flex w-fit items-center gap-1.5 rounded-md px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-50 disabled:opacity-70 dark:hover:bg-neutral-900"
      >
        <FiThumbsUp size={13} className={hasMarkedHelpful ? 'fill-primary-500 text-primary-500' : ''} />
        Helpful{hasMarkedHelpful ? ' ✓' : ''} ({helpfulCount})
      </button>

      {lightboxIndex !== null && (
        <ReviewImageLightbox images={review.images} activeIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
      )}
    </article>
  );
}