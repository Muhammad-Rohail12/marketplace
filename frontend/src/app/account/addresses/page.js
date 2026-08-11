'use client';

import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AddressList from '@/components/address/AddressList';

function AddressesContent() {
  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-2xl font-semibold">My Addresses</h1>
      <AddressList />
    </div>
  );
}

export default function AddressesPage() {
  return (
    <MainLayout>
      <ProtectedRoute>
        <AddressesContent />
      </ProtectedRoute>
    </MainLayout>
  );
}