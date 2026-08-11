export default function SpecificationTable({ items = [] }) {
  if (!items.length) return null;

  return (
    <table className="w-full text-sm">
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
            <td className="w-1/3 py-2 pr-4 text-gray-500">{item.label}</td>
            <td className="py-2">{item.value ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}