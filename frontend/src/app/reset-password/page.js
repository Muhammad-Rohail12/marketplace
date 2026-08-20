import { Suspense } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import PageLoader from '@/components/feedback/PageLoader';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <AuthLayout showBrandPanel={false}>
      <h2 className="text-2xl font-semibold">Set a new password</h2>
      <p className="mt-1 mb-6 text-sm text-neutral-500">Choose a strong password for your account.</p>

      <Suspense fallback={<PageLoader label="Loading..." />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}