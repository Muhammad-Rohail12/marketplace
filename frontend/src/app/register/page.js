import AuthLayout from '@/components/layout/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Create Account',
};

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
