import AuthLayout from '@/components/auth/AuthLayout';
import AuthSwitchLink from '@/components/auth/AuthSwitchLink';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { ROUTES } from '@/constants/routes';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout showBrandPanel={false}>
      <h2 className="text-2xl font-semibold">Reset your password</h2>
      <p className="mt-1 mb-6 text-sm text-neutral-500">Enter your email and we&apos;ll send you a reset link.</p>

      <ForgotPasswordForm />

      <div className="mt-6">
        <AuthSwitchLink prompt="Remembered your password?" linkLabel="Sign in" href={ROUTES.LOGIN} />
      </div>
    </AuthLayout>
  );
}