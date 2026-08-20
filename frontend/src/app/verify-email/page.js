import { Suspense } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import PageLoader from '@/components/feedback/PageLoader';
import VerifyEmailStatus from '@/components/auth/VerifyEmailStatus';

export default function VerifyEmailPage() {
  return (
    <AuthLayout showBrandPanel={false}>
      <h2 className="text-2xl font-semibold">Verify your email</h2>
      <p className="mt-1 mb-6 text-sm text-neutral-500">Confirming your email address...</p>

      <Suspense fallback={<PageLoader label="Verifying..." />}>
        <VerifyEmailStatus />
      </Suspense>
    </AuthLayout>
  );
}