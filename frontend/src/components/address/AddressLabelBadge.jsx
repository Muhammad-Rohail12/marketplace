import Badge from '@/components/ui/Badge';

const VARIANTS = { HOME: 'primary', WORK: 'neutral', OTHER: 'neutral' };

export default function AddressLabelBadge({ label }) {
  return <Badge variant={VARIANTS[label] || 'neutral'}>{label}</Badge>;
}