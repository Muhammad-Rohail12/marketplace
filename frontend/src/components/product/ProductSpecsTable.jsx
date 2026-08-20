export default function ProductSpecsTable({ specifications = [] }) {
  const technical = specifications.filter((s) => s.group === 'TECHNICAL');
  if (technical.length === 0) return null;

  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold uppercase text-neutral-500">Technical Specifications</h2>
      <table className="w-full text-sm">
        <tbody>
          {technical.map((s, i) => (
            <tr key={i} className="border-b border-neutral-100 dark:border-neutral-800">
              <td className="w-1/3 py-2 pr-4 text-neutral-500">{s.label}</td>
              <td className="py-2">{s.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}