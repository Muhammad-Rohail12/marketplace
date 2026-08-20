'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FiAlertTriangle } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

// Route-segment error boundary — catches any unhandled rendering
// error below the root layout and shows a real recovery UI instead
// of Next.js's default overlay/blank screen in production.
export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Route error boundary caught:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <FiAlertTriangle size={48} className="text-danger-500" />
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="max-w-sm text-sm text-neutral-500">
        We hit an unexpected error loading this page. You can try again, or head back home.
      </p>
      <div className="flex gap-2">
        <Button onClick={reset}>Try Again</Button>
        <Link href={ROUTES.HOME}><Button variant="outline">Go Home</Button></Link>
      </div>
    </div>
  );
}