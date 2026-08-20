'use client';

import { useEffect, useState } from 'react';

function getTimeParts(endAt) {
  const diff = new Date(endAt).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

const pad = (n) => String(n).padStart(2, '0');

// Only renders when a real endAt timestamp exists (Phase 25's
// Discount.endAt) — never fabricates an end time for an ongoing/
// no-expiry discount.
export default function CountdownTimer({ endAt, onExpire, compact = false }) {
  const [parts, setParts] = useState(() => getTimeParts(endAt));

  useEffect(() => {
    if (!endAt) return undefined;
    const interval = setInterval(() => {
      const next = getTimeParts(endAt);
      setParts(next);
      if (!next) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endAt, onExpire]);

  if (!endAt || !parts) return null;

  if (compact) {
    return (
      <span className="font-mono text-xs font-semibold text-danger-600">
        {parts.days > 0 && `${parts.days}d `}{pad(parts.hours)}:{pad(parts.minutes)}:{pad(parts.seconds)}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2" role="timer" aria-live="off">
      {[{ label: 'Days', value: parts.days }, { label: 'Hrs', value: parts.hours }, { label: 'Min', value: parts.minutes }, { label: 'Sec', value: parts.seconds }].map((unit) => (
        <div key={unit.label} className="flex flex-col items-center rounded-md bg-neutral-900 px-2.5 py-1.5 text-white">
          <span className="font-mono text-lg font-bold leading-none">{pad(unit.value)}</span>
          <span className="text-2xs uppercase text-neutral-400">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}