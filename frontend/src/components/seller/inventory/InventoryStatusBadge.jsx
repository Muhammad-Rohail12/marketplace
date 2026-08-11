import Badge from '@/components/ui/Badge';

const VARIANTS = { IN_STOCK: 'success', LOW_STOCK: 'warning', OUT_OF_STOCK: 'danger', BACKORDER: 'warning', DISCONTINUED: 'neutral' };
const LABELS = { IN_STOCK: 'In Stock', LOW_STOCK: 'Low Stock', OUT_OF_STOCK: 'Out of Stock', BACKORDER: 'Backorder', DISCONTINUED: 'Discontinued' };

export default function InventoryStatusBadge({ status }) {
  return <Badge variant={VARIANTS[status] || 'neutral'}>{LABELS[status] || status}</Badge>;
}