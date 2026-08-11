import Badge from '@/components/ui/Badge';

const VARIANTS = {
  DRAFT: 'neutral',
  SUBMITTED: 'primary',
  UNDER_REVIEW: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  SUSPENDED: 'danger',
  CANCELLED: 'neutral',
};

const LABELS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  SUSPENDED: 'Suspended',
  CANCELLED: 'Cancelled',
};

export default function ApplicationStatusBadge({ status }) {
  return <Badge variant={VARIANTS[status] || 'neutral'}>{LABELS[status] || status}</Badge>;
}