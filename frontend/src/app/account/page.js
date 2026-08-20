'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AccountLayout from '@/components/account/AccountLayout';
import AccountStatCard from '@/components/account/AccountStatCard';
import RecentOrdersWidget from '@/components/account/RecentOrdersWidget';
import { FiPackage, FiMapPin, FiHeart } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import { addressService } from '@/services/addressService';
import { getWishlistItems } from '@/utils/wishlistStorage';

function AccountOverviewContent() {
  const { user } = useAuth();
  const [orderCount, setOrderCount] = useState('—');
  const [addressCount, setAddressCount] = useState('—');
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    orderService.listMine({ limit: 1 }).then((res) => setOrderCount(res.meta?.totalCount ?? res.data.orders.length)).catch(() => setOrderCount(0));
    addressService.list().then((res) => setAddressCount(res.data.addresses.length)).catch(() => setAddressCount(0));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWishlistCount(getWishlistItems().length);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Hi, {user?.firstName} 👋</h1>
        <p className="text-sm text-neutral-500">Here&apos;s a quick look at your account.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <AccountStatCard label="Orders" value={orderCount} href="/account/orders" icon={FiPackage} />
        <AccountStatCard label="Saved Addresses" value={addressCount} href="/account/addresses" icon={FiMapPin} />
        <AccountStatCard label="Wishlist Items" value={wishlistCount} href="/account/wishlist" icon={FiHeart} />
      </div>

      <RecentOrdersWidget />
    </div>
  );
}

export default function AccountOverviewPage() {
  return (
    <AccountLayout>
      <ProtectedRoute>
        <AccountOverviewContent />
      </ProtectedRoute>
    </AccountLayout>
  );
}