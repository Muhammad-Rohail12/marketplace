import Badge from '@/components/ui/Badge';

const VARIANTS = { IN_STOCK: 'success', LOW_STOCK: 'warning', OUT_OF_STOCK: 'danger', BACKORDER: 'warning', DISCONTINUED: 'neutral' };

export default function AvailabilityBadge({ availability }) {
  if (!availability) return null;
  return <Badge variant={VARIANTS[availability.status] || 'neutral'}>{availability.label}</Badge>;
}