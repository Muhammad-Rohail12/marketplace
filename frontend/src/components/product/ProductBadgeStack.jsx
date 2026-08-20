import Badge from '@/components/ui/Badge';
import DealBadge from '@/components/deals/DealBadge';

const NEW_WINDOW_DAYS = 14;

const isNew = (createdAt) => {
  if (!createdAt) return false;
  const ageMs = Date.now() - new Date(createdAt).getTime();
  return ageMs <= NEW_WINDOW_DAYS * 86400000;
};

// Every badge here is derived from real product data (createdAt,
// pricing.discountPercentage) — never a fabricated "Bestseller"
// label, since no sales-count aggregation exists in the backend yet.
export default function ProductBadgeStack({ product, className = '' }) {
  const badges = [];
  if (product.pricing?.hasDiscount) badges.push(<DealBadge key="deal" percentage={product.pricing.discountPercentage} />);
  if (isNew(product.createdAt)) badges.push(<Badge key="new" variant="primary">New</Badge>);

  if (badges.length === 0) return null;

  return <div className={`flex flex-col gap-1 ${className}`}>{badges}</div>;
}