import { MESSAGES } from '@/constants/messages';

export default function EmptyState({ title = 'Nothing here yet', message = MESSAGES.EMPTY_DEFAULT, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-gray-500">{message}</p>
      {action}
    </div>
  );
}
