import { FiTruck, FiRefreshCw, FiCreditCard, FiHeadphones } from 'react-icons/fi';

const ITEMS = [
  { icon: FiTruck, title: 'Fast Shipping', desc: 'On eligible orders across the US' },
  { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: FiCreditCard, title: 'Secure Payment', desc: 'All major cards accepted' },
  { icon: FiHeadphones, title: 'Customer Support', desc: '7 days a week' },
];

// Reusable trust bar — intentionally NOT injected into MainLayout
// globally (would repeat on every page); Phase 34 (Homepage Hero)
// mounts this directly where it belongs.
export default function TrustBadgesBar() {
  return (
    <div className="border-y border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
      <div className="container-page grid grid-cols-2 gap-6 py-6 sm:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3">
            <Icon size={24} className="shrink-0 text-primary-600" />
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-neutral-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}