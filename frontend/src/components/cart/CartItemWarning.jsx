export default function CartItemWarning({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-xs font-medium text-warning-600">
      ⚠ {message}
    </p>
  );
}