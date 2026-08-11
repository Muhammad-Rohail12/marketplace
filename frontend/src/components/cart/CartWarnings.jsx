export default function CartWarnings({ warnings = [] }) {
  if (!warnings.length) return null;

  return (
    <div role="alert" className="flex flex-col gap-1 rounded-md bg-warning-500/10 p-3 text-sm text-warning-700 dark:text-warning-400">
      {warnings.map((w, i) => (
        <p key={i}>⚠ {w.productName}: {w.message}</p>
      ))}
    </div>
  );
}