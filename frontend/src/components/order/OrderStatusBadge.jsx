import Badge from '@/components/ui/Badge';

const VARIANTS = { PENDING_PAYMENT: 'neutral', PAID: 'primary', PROCESSING: 'warning', SHIPPED: 'primary', DELIVERED: 'success', CANCELLED: 'danger', REFUNDED: 'danger' };

export default function OrderStatusBadge({ status }) {
  return <Badge variant={VARIANTS[status] || 'neutral'}>{status.replace(/_/g, ' ')}</Badge>;
}