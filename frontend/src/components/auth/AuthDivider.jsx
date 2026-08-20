export default function AuthDivider({ label = 'or' }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
      <span className="text-2xs uppercase text-neutral-400">{label}</span>
      <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
    </div>
  );
}