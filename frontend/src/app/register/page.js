import AuthLayout from '@/components/auth/AuthLayout';
import AuthDivider from '@/components/auth/AuthDivider';
import AuthSwitchLink from '@/components/auth/AuthSwitchLink';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import RegisterForm from '@/components/auth/RegisterForm';
import { ROUTES } from '@/constants/routes';

export default function RegisterPage() {
  return (
    <AuthLayout>
      <h2 className="text-2xl font-semibold">Create your account</h2>
      <p className="mt-1 mb-6 text-sm text-neutral-500">Join thousands of shoppers across the US.</p>

      <RegisterForm />

      <div className="my-6"><AuthDivider /></div>
      <SocialLoginButtons />

      <div className="mt-6">
        <AuthSwitchLink prompt="Already have an account?" linkLabel="Sign in" href={ROUTES.LOGIN} />
      </div>
    </AuthLayout>
  );
}