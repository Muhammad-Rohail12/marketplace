import StoreBanner from './StoreBanner';
import StoreLogo from './StoreLogo';
import StoreLocation from './StoreLocation';
import SellerVerificationBadge from './SellerVerificationBadge';

export default function StoreHeader({ store }) {
  return (
    <div className="flex flex-col">
      <StoreBanner store={store} />
      <div className="container-page -mt-8 flex items-end gap-4 pb-4">
        <StoreLogo store={store} size={80} className="border-4 border-white shadow-md dark:border-gray-900" />
        <div className="flex flex-1 items-center justify-between pb-1">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold">
              {store.name}
              <SellerVerificationBadge isActive />
            </h1>
            <StoreLocation store={store} />
          </div>
        </div>
      </div>
    </div>
  );
}