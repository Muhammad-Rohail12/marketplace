import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-surface-dark">
      <div className="w-full max-w-md">
        <Link href={ROUTES.HOME} className="mb-6 block text-center text-lg font-bold text-primary-600">
          ZAF Cart
        </Link>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-gray-900">
          {children}
        </div>
      </div>
    </div>
  );
}