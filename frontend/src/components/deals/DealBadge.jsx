import Badge from '@/components/ui/Badge';

export default function DealBadge({ percentage }) {
  if (!percentage) return null;
  return <Badge variant="danger" className="font-bold">-{percentage}%</Badge>;
}