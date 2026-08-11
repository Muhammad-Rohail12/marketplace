'use client';

const getStrength = (password = '') => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const LEVELS = [
  { label: 'Too weak', color: 'bg-danger-500' },
  { label: 'Weak', color: 'bg-danger-500' },
  { label: 'Fair', color: 'bg-warning-500' },
  { label: 'Good', color: 'bg-warning-500' },
  { label: 'Strong', color: 'bg-success-500' },
  { label: 'Very strong', color: 'bg-success-500' },
];

export default function PasswordStrengthIndicator({ password = '' }) {
  if (!password) return null;

  const score = getStrength(password);
  const level = LEVELS[score];
  const filledBars = Math.max(1, score);

  return (
    <div className="flex flex-col gap-1" aria-live="polite">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < filledBars ? level.color : 'bg-gray-200 dark:bg-gray-700'}`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">{level.label}</span>
    </div>
  );
}