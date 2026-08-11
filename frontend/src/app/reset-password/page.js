import { Suspense } from 'react';
import AuthLayout from '@/components/layout/AuthLayout';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import PageLoader from '@/components/feedback/PageLoader';

export const metadata = {
  title: 'Reset Password',
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<PageLoader label="Loading..." />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}