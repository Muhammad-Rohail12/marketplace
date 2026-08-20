import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthDivider from '@/components/auth/AuthDivider';
import AuthSwitchLink from '@/components/auth/AuthSwitchLink';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import LoginForm from '@/components/auth/LoginForm';
import { ROUTES } from '@/constants/routes';

export default function LoginPage() {
  return (
    <AuthLayout>
      <h2 className="text-2xl font-semibold">Welcome back</h2>
      <p className="mt-1 mb-6 text-sm text-neutral-500">Sign in to your account to continue.</p>

      <LoginForm />

      <div className="mt-3 text-right">
        <Link href={ROUTES.FORGOT_PASSWORD} className="text-sm font-medium text-primary-600 hover:underline">
          Forgot password?
        </Link>
      </div>

      <div className="my-6"><AuthDivider /></div>
      <SocialLoginButtons />

      <div className="mt-6">
        <AuthSwitchLink prompt="Don't have an account?" linkLabel="Create one" href={ROUTES.REGISTER} />
      </div>
    </AuthLayout>
  );
}