import Spinner from '../ui/Spinner';

export default function PageLoader({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <Spinner size={32} />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
