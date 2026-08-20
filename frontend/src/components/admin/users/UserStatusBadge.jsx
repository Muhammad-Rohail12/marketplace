export default function UserStatusBadge({ status }) {
  const styles = {
    ACTIVE: 'bg-success-500/10 text-success-700',
    INACTIVE: 'bg-neutral-500/10 text-neutral-600',
    SUSPENDED: 'bg-danger-500/10 text-danger-700',
  };

  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || styles.INACTIVE}`}>{status}</span>;
}