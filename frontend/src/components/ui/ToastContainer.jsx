'use client';

import Toast from './Toast';

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed right-4 top-4 z-[100] flex flex-col gap-2" aria-live="polite">
      {toasts.map((t) => <Toast key={t.id} {...t} onDismiss={onDismiss} />)}
    </div>
  );
}