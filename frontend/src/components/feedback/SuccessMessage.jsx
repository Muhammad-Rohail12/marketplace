export default function SuccessMessage({ message }) {
  return (
    <div
      role="status"
      className="rounded-md bg-success-500/10 px-4 py-3 text-sm font-medium text-success-600"
    >
      {message}
    </div>
  );
}
