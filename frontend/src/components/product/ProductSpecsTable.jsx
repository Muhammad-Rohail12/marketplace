export default function ProductSpecsTable({ specifications = [] }) {
  if (!specifications.length) return null;
  const general = specifications.filter((s) => s.group === 'GENERAL');
  const technical = specifications.filter((s) => s.group === 'TECHNICAL');

  const renderGroup = (title, items) =>
    items.length > 0 && (
      <div key={title}>
        <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">{title}</h3>
        <table className="w-full text-sm">
          <tbody>
            {items.map((s, i) => (
              <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                <td className="w-1/3 py-2 pr-4 text-gray-500">{s.label}</td>
                <td className="py-2">{s.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      {renderGroup('General', general)}
      {renderGroup('Technical Specifications', technical)}
    </div>
  );
}