'use client';

import { useEffect, useState } from 'react';
import SellerLayout from '@/components/layout/SellerLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import PageLoader from '@/components/feedback/PageLoader';
import ErrorState from '@/components/feedback/ErrorState';
import StoreStatusBadge from '@/components/store/StoreStatusBadge';
import StoreSettingsForm from '@/components/seller/store/StoreSettingsForm';
import StoreBrandingForm from '@/components/seller/store/StoreBrandingForm';
import StorePolicyForm from '@/components/seller/store/StorePolicyForm';
import StorePreview from '@/components/store/StorePreview';
import Button from '@/components/ui/Button';
import { storeService } from '@/services/storeService';
import { ROLES } from '@/constants/roles';

const TABS = ['Settings', 'Branding', 'Policies', 'Preview'];

function StoreManagementContent() {
  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const load = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await storeService.getMyStore();
      setStore(res.data.store);
    } catch (err) {
      setLoadError(err.message || 'Failed to load your store');
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  if (isLoading) return <PageLoader label="Loading your store..." />;
  if (loadError) return <ErrorState message={loadError} onRetry={load} />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{store.name}</h1>
          <div className="mt-1 flex items-center gap-2">
            <StoreStatusBadge status={store.status} />
            <a href={`/store/${store.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">
              View public page ↗
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <Card>
        {activeTab === 'Settings' && <StoreSettingsForm store={store} onUpdated={setStore} />}
        {activeTab === 'Branding' && <StoreBrandingForm store={store} onUpdated={setStore} />}
        {activeTab === 'Policies' && <StorePolicyForm store={store} onUpdated={setStore} />}
        {activeTab === 'Preview' && <StorePreview store={store} />}
      </Card>
    </div>
  );
}

export default function SellerStorePage() {
  return (
    <SellerLayout>
      <ProtectedRoute allowedRoles={[ROLES.SELLER]}>
        <StoreManagementContent />
      </ProtectedRoute>
    </SellerLayout>
  );
}