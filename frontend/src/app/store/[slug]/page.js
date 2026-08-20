import { notFound } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import StoreHeader from '@/components/store/StoreHeader';
import StoreInfo from '@/components/store/StoreInfo';
import StoreContact from '@/components/store/StoreContact';
import StorePolicies from '@/components/store/StorePolicies';
import StoreProductsGrid from '@/components/store/StoreProductsGrid';
import { storeService } from '@/services/storeService';

export default async function PublicStorePage({ params }) {
  let store;
  try {
    const { slug } = await params;
    const res = await storeService.getPublicStore(slug);
    store = res.data.store;
  } catch {
    notFound();
  }

  return (
    <MainLayout>
      <StoreHeader store={store} />
      <div className="container-page flex flex-col gap-6 py-6">
        <StoreInfo store={store} />
        {store.contact && <StoreContact contact={store.contact} />}
        <StorePolicies policies={store.policies} />
        <StoreProductsGrid storeId={store.id} />
      </div>
    </MainLayout>
  );
}