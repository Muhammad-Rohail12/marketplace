'use client';

import { FiClock } from 'react-icons/fi';
import CountdownTimer from '@/components/deals/CountdownTimer';

// Reuses the real countdown primitive from Phase 36 against the
// session's genuine expiresAt (Phase 29) — no fabricated urgency,
// this is the actual inventory-reservation deadline.
export default function CheckoutSessionTimer({ expiresAt, onExpire }) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-warning-50 px-3 py-2 text-sm text-warning-700 dark:bg-warning-500/10 dark:text-warning-400">
      <FiClock size={15} className="shrink-0" />
      <span>Your items are reserved for</span>
      <CountdownTimer endAt={expiresAt} onExpire={onExpire} compact />
    </div>
  );
}