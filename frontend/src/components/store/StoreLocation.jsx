export default function StoreLocation({ store }) {
  const parts = [store.city, store.stateProvince, store.country].filter(Boolean);
  if (!parts.length) return null;
  return <p className="text-sm text-gray-500">📍 {parts.join(', ')}</p>;
}