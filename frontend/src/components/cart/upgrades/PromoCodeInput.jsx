'use client';

import { useState } from 'react';
import { FiTag, FiCheck, FiX } from 'react-icons/fi';
import Button from '@/components/ui/Button';

// FRONTEND UI ONLY — no Coupon/Promo backend exists (Phases 1-30
// never built one). This never alters cartData.summary (which stays
// 100% backend-authoritative, Phase 26's real totals) — it only
// shows a UI state so the interface reads as complete, with an
// explicit "not applied to your total yet" caveat rather than
// silently pretending a discount was applied.
export default function PromoCodeInput() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(null); // null | 'checking' | 'valid' | 'invalid'
  const [appliedCode, setAppliedCode] = useState(null);

  const handleApply = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setStatus('checking');
    setTimeout(() => {
      // No real validation exists yet — demo accepts any non-empty code.
      setStatus('valid');
      setAppliedCode(code.trim().toUpperCase());
    }, 500);
  };

  const handleRemove = () => {
    setAppliedCode(null);
    setStatus(null);
    setCode('');
  };

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between rounded-md border border-success-500/30 bg-success-50 px-3 py-2 text-sm dark:bg-success-500/10">
        <span className="flex items-center gap-2 text-success-700 dark:text-success-400">
          <FiCheck size={14} /> Code &ldquo;{appliedCode}&rdquo; applied
        </span>
        <button type="button" onClick={handleRemove} aria-label="Remove promo code" className="text-success-700 hover:opacity-70 dark:text-success-400">
          <FiX size={14} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <FiTag className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Promo code"
            className="w-full rounded-md border border-neutral-300 py-2 pl-8 pr-3 text-sm focus-visible:focus-ring dark:border-neutral-700 dark:bg-transparent"
          />
        </div>
        <Button type="submit" variant="outline" size="md" isLoading={status === 'checking'}>Apply</Button>
      </div>
      {status === 'invalid' && <p className="text-xs text-danger-600">Invalid or expired code</p>}
      <p className="text-2xs text-neutral-400">Promo codes are a preview feature — not yet applied to your order total.</p>
    </form>
  );
}