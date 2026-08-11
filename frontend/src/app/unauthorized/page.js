import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import ErrorState from '@/components/feedback/ErrorState';
import { ROUTES } from '@/constants/routes';

export const metadata = {
  title: 'Sign in required',
};

export default function UnauthorizedPage() {
  return (
    <MainLayout>
      <div className="container-page flex flex-col items-center gap-4 py-16">
        <ErrorState message="You need to be logged in to view this page." />
        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus-visible:focus-ring"
        >
          Log in
        </Link>
      </div>
    </MainLayout>
  );
}