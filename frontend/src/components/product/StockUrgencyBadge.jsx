import { FiAlertTriangle, FiCheckCircle, FiClock } from 'react-icons/fi';

// Built strictly from the real coarse status Phase 24's public
// availability endpoint returns — never fabricates an exact
// remaining-quantity number (Phase 24 deliberately withholds that
// publicly; this component respects that boundary rather than
// working around it).
export default function StockUrgencyBadge({ availability }) {
  if (!availability) return null;

  const config = {
    LOW_STOCK: { icon: FiAlertTriangle, text: 'Low stock — order soon', className: 'text-warning-600' },
    BACKORDER: { icon: FiClock, text: 'Available on backorder', className: 'text-warning-600' },
    IN_STOCK: { icon: FiCheckCircle, text: 'In stock, ready to ship', className: 'text-success-600' },
  }[availability.status];

  if (!config) return null;
  const Icon = config.icon;

  return (
    <p className={`flex items-center gap-1.5 text-sm font-medium ${config.className}`}>
      <Icon size={15} /> {config.text}
    </p>
  );
}