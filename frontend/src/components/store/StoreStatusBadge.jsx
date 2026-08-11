import Badge from '@/components/ui/Badge';

const VARIANTS = { DRAFT: 'neutral', ACTIVE: 'success', INACTIVE: 'neutral', SUSPENDED: 'danger', CLOSED: 'danger' };

export default function StoreStatusBadge({ status }) {
  return <Badge variant={VARIANTS[status] || 'neutral'}>{status}</Badge>;
}