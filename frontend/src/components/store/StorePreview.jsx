import StoreHeader from './StoreHeader';
import StoreInfo from './StoreInfo';
import StoreContact from './StoreContact';
import StorePolicies from './StorePolicies';

export default function StorePreview({ store }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <StoreHeader store={store} />
      <div className="container-page flex flex-col gap-6 pb-8 pt-4">
        <StoreInfo store={store} />
        {store.showContactInformation && (
          <StoreContact contact={{ email: store.email, phone: store.phone, website: store.website }} />
        )}
        <StorePolicies policies={store.policies} />
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400 dark:border-gray-700">
          Products will appear here in a future update.
        </div>
      </div>
    </div>
  );
}