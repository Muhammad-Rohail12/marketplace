import { formatMoney } from '@/utils/currencyFormat';
import Badge from '@/components/ui/Badge';

// Single reusable pricing display — ProductCard, product page, and
// seller dashboard all render pricing through this component so
// formatting never drifts between contexts.
export default function PriceDisplay({ pricing, size = 'md' }) {
  if (!pricing || !pricing.hasPrice) {
    return <span className="text-sm text-gray-400">Price coming soon</span>;
  }

  const priceClass = size === 'lg' ? 'text-2xl font-semibold' : 'text-sm font-semibold';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={priceClass}>{formatMoney(pricing.effectivePrice, pricing.currency)}</span>
      {pricing.hasDiscount && pricing.compareAtPrice && (
        <span className="text-sm text-gray-400 line-through">{formatMoney(pricing.compareAtPrice, pricing.currency)}</span>
      )}
      {pricing.hasDiscount && pricing.discountPercentage > 0 && (
        <Badge variant="danger">{pricing.discountPercentage}% OFF</Badge>
      )}
    </div>
  );
}