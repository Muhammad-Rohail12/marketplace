import { MESSAGES } from '@/constants/messages';
import Button from '../ui/Button';

export default function ErrorState({ message = MESSAGES.GENERIC_ERROR, onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-danger-600 font-medium">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
