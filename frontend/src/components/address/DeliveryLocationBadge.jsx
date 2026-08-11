'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { addressService } from '@/services/addressService';

// Header foundation — shows the customer's default/selected delivery
// destination without exposing the full private address publicly.
// Does NOT use browser geolocation by default (spec: "do not force
// browser geolocation"); falls back to a generic US prompt when
// logged out or no address is saved yet.
export default function DeliveryLocationBadge() {
  const { isAuthenticated } = useAuth();
  const [address, setAddress] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAddress(null);
      return;
    }
    addressService.list().then((res) => {
      const defaultAddr = res.data.addresses.find((a) => a.isDefault) || res.data.addresses[0];
      setAddress(defaultAddr || null);
    }).catch(() => setAddress(null));
  }, [isAuthenticated]);

  const label = address ? `${address.city}, ${address.stateCode} ${address.postalCode}` : 'United States';

  return (
    <Link href={isAuthenticated ? '/account/addresses' : '/login'} className="hidden flex-col text-xs leading-tight lg:flex">
      <span className="text-gray-400">Deliver to</span>
      <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </Link>
  );
}