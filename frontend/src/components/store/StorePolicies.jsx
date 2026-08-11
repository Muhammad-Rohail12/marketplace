const LABELS = { RETURN: 'Return Policy', SHIPPING: 'Shipping Policy', CANCELLATION: 'Cancellation Policy', PRIVACY: 'Privacy Policy', TERMS: 'Store Terms' };

export default function StorePolicies({ policies = [] }) {
  if (!policies.length) return null;
  return (
    <div className="flex flex-col gap-4">
      {policies.map((p) => (
        <div key={p.type}>
          <h3 className="mb-1 text-sm font-semibold">{LABELS[p.type] || p.type}</h3>
          <p className="text-sm text-gray-500 whitespace-pre-wrap">{p.content}</p>
        </div>
      ))}
    </div>
  );
}