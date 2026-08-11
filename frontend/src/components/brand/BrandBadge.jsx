import Badge from '@/components/ui/Badge';

export default function BrandBadge({ brand }) {
  if (!brand?.isVerified) return null;
  return <Badge variant="primary">✓ Verified</Badge>;
}