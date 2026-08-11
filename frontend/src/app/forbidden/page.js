import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import ErrorState from '@/components/feedback/ErrorState';
import { ROUTES } from '@/constants/routes';

export const metadata = {
  title: 'Access denied',
};

export default function ForbiddenPage() {
  return (
    <MainLayout>
      <div className="container-page flex flex-col items-center gap-4 py-16">
        <ErrorState message="You don't have permission to access this page." />
        <Link
          href={ROUTES.HOME}
          className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus-visible:focus-ring"
        >
          Back to home
        </Link>
      </div>
    </MainLayout>
  );
}