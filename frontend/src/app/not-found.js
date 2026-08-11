import MainLayout from '@/components/layout/MainLayout';
import ErrorState from '@/components/feedback/ErrorState';

export default function NotFound() {
  return (
    <MainLayout>
      <div className="container-page py-16">
        <ErrorState message="Page not found — the page you're looking for doesn't exist." />
      </div>
    </MainLayout>
  );
}
