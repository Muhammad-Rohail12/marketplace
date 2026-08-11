import Badge from '@/components/ui/Badge';

const VARIANTS = { DRAFT: 'neutral', PENDING_REVIEW: 'warning', ACTIVE: 'success', INACTIVE: 'neutral', REJECTED: 'danger', ARCHIVED: 'neutral', OUT_OF_STOCK: 'danger' };
const LABELS = { DRAFT: 'Draft', PENDING_REVIEW: 'Pending Review', ACTIVE: 'Active', INACTIVE: 'Inactive', REJECTED: 'Rejected', ARCHIVED: 'Archived', OUT_OF_STOCK: 'Out of Stock' };

export default function ProductStatusBadge({ status }) {
  return <Badge variant={VARIANTS[status] || 'neutral'}>{LABELS[status] || status}</Badge>;
}