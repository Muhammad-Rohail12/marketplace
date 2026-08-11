import { Suspense } from 'react';
import AuthLayout from '@/components/layout/AuthLayout';
import VerifyEmailStatus from '@/components/auth/VerifyEmailStatus';
import PageLoader from '@/components/feedback/PageLoader';

export const metadata = {
  title: 'Verify Email',
};

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<PageLoader label="Loading..." />}>
        <VerifyEmailStatus />
      </Suspense>
    </AuthLayout>
  );
}