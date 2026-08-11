export default function StoreContact({ contact }) {
  if (!contact) return null;
  return (
    <div className="flex flex-col gap-1 text-sm">
      {contact.email && <p>✉️ {contact.email}</p>}
      {contact.phone && <p>📞 {contact.phone}</p>}
      {contact.website && (
        <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
          🌐 Visit website ↗
        </a>
      )}
    </div>
  );
}