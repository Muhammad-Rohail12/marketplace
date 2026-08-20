'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AccountLayout from '@/components/account/AccountLayout';
import AddressList from '@/components/address/AddressList';

function AddressesContent() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">My Addresses</h1>
      <AddressList />
    </div>
  );
}

export default function AddressesPage() {
  return (
    <AccountLayout>
      <ProtectedRoute>
        <AddressesContent />
      </ProtectedRoute>
    </AccountLayout>
  );
}