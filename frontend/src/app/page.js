import ConnectionStatus from '@/components/ConnectionStatus';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gray-50 px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Marketplace</h1>
        <p className="mt-2 text-lg text-gray-600">
          A multi-vendor marketplace platform — foundation build
        </p>
      </div>

      <nav className="flex gap-6 text-sm font-medium text-gray-500">
        <span>Home</span>
        <span>Products</span>
        <span>Categories</span>
        <span>Cart</span>
        <span>Account</span>
      </nav>

      <ConnectionStatus />

      <p className="text-xs text-gray-400">Phase 1 — Development Environment Setup</p>
    </main>
  );
}