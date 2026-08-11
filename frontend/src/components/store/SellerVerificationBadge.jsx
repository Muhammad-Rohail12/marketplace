import Badge from '@/components/ui/Badge';

// Foundation only — real seller "verification" (KYC/documents) is a
// future phase; this reflects the store simply being ACTIVE for now.
export default function SellerVerificationBadge({ isActive }) {
  if (!isActive) return null;
  return <Badge variant="primary">✓ Active Seller</Badge>;
}