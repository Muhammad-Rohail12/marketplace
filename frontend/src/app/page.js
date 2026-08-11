import MainLayout from '@/components/layout/MainLayout';
import ConnectionStatus from '@/components/common/ConnectionStatus';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function Home() {
  return (
    <MainLayout>
      <section className="container-page flex flex-col items-center gap-8 py-16 text-center">
        <Badge variant="primary">Foundation Build</Badge>

        <div>
          <h1 className="text-4xl font-bold sm:text-5xl">Marketplace</h1>
          <p className="mt-3 max-w-lg text-lg text-gray-600 dark:text-gray-400">
            A professional multi-vendor marketplace — original design, built from the ground up.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="primary">Browse Products</Button>
          <Button variant="outline">Become a Seller</Button>
        </div>

        <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
          <Card>
            <h3 className="font-semibold">Discover</h3>
            <p className="mt-1 text-sm text-gray-500">Search, filter, and browse products across every seller.</p>
          </Card>
          <Card>
            <h3 className="font-semibold">Sell</h3>
            <p className="mt-1 text-sm text-gray-500">Manage your own storefront, inventory, and orders.</p>
          </Card>
          <Card>
            <h3 className="font-semibold">Deliver</h3>
            <p className="mt-1 text-sm text-gray-500">Fast, stock-aware checkout built for real shopping.</p>
          </Card>
        </div>

        <ConnectionStatus />

        <p className="text-xs text-gray-400">Phase 4 — Frontend Foundation &amp; Design System</p>
      </section>
    </MainLayout>
  );
}