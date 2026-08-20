import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import AuthBrandPanel from './AuthBrandPanel';

export default function AuthLayout({ children, showBrandPanel = true }) {
  return (
    <div className="flex min-h-screen">
      {showBrandPanel && (
        <div className="hidden lg:block lg:w-1/2">
          <AuthBrandPanel />
        </div>
      )}
      <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-12 lg:w-1/2">
        <div className="mx-auto w-full max-w-sm">
          <Link href={ROUTES.HOME} className="mb-8 inline-block text-xl font-bold text-primary-600">
            ZAF Cart
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}