'use client';

import { FiChrome } from 'react-icons/fi';

// No OAuth backend exists yet (no Google/Apple sign-in route in
// Phases 1-30). Rendered visibly DISABLED with a clear label rather
// than a fake working button — same honest-mock precedent as Phase
// 43's promo code and Phase 44's payment selector.
export default function SocialLoginButtons() {
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled
        title="Coming soon"
        className="flex items-center justify-center gap-2 rounded-md border border-neutral-300 py-2 text-sm font-medium text-neutral-400 opacity-60 dark:border-neutral-700"
      >
        <FiChrome size={16} /> Continue with Google
      </button>
      <p className="text-center text-2xs text-neutral-400">Social sign-in is coming soon.</p>
    </div>
  );
}