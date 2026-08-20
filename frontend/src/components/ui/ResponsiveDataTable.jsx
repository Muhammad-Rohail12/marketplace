// Generic table-on-desktop / stacked-cards-on-mobile primitive.
// Columns define how to render each field in BOTH modes so there is
// one source of truth per column, not two parallel markup trees.
//
// column shape: { key, label, render?: (row) => node, hideOnMobile?: bool }
export default function ResponsiveDataTable({ columns, rows, rowKey, actions, emptyMessage = 'No data available' }) {
  if (!rows || rows.length === 0) {
    return <p className="py-8 text-center text-sm text-neutral-400">{emptyMessage}</p>;
  }

  const getValue = (row, col) => (col.render ? col.render(row) : row[col.key]);

  return (
    <>
      {/* Desktop: real table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800">
              {columns.map((col) => <th key={col.key} className="py-2 pr-4 font-medium">{col.label}</th>)}
              {actions && <th className="py-2 pr-4 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[rowKey]} className="border-b border-neutral-100 dark:border-neutral-900">
                {columns.map((col) => <td key={col.key} className="py-2 pr-4">{getValue(row, col)}</td>)}
                {actions && <td className="flex flex-wrap gap-1 py-2 pr-4">{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards, one per row */}
      <div className="flex flex-col gap-3 md:hidden">
        {rows.map((row) => (
          <div key={row[rowKey]} className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
            <div className="flex flex-col gap-1.5">
              {columns.filter((c) => !c.hideOnMobile).map((col) => (
                <div key={col.key} className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-xs font-medium uppercase text-neutral-400">{col.label}</span>
                  <span className="text-right">{getValue(row, col)}</span>
                </div>
              ))}
            </div>
            {actions && <div className="mt-3 flex flex-wrap gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-900">{actions(row)}</div>}
          </div>
        ))}
      </div>
    </>
  );
}