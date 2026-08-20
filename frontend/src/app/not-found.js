import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

// Global 404 — also automatically used by any route that calls
// notFound() (already used since Phase 22/38/40's product/category pages).
export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="text-6xl font-bold text-neutral-200 dark:text-neutral-800">404</span>
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="max-w-sm text-sm text-neutral-500">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href={ROUTES.HOME}><Button>Go Home</Button></Link>
          <Link href="/search"><Button variant="outline" className="flex items-center gap-2"><FiSearch size={14} /> Search Products</Button></Link>
        </div>
      </div>
    </MainLayout>
  );
}