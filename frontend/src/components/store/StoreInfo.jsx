export default function StoreInfo({ store }) {
  return (
    <div className="flex flex-col gap-2">
      {store.shortDescription && <p className="text-sm text-gray-600 dark:text-gray-400">{store.shortDescription}</p>}
      {store.description && <p className="text-sm text-gray-500">{store.description}</p>}
    </div>
  );
}