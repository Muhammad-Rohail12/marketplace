'use client';

export default function QuantitySelector({ quantity, onChange, min = 1, max = 999, disabled = false }) {
  const dec = () => onChange(Math.max(min, quantity - 1));
  const inc = () => onChange(Math.min(max, quantity + 1));

  return (
    <div className="flex items-center rounded-md border border-neutral-300 dark:border-neutral-700">
      <button
        type="button"
        onClick={dec}
        disabled={disabled || quantity <= min}
        aria-label="Decrease quantity"
        className="flex h-11 w-11 items-center justify-center text-base disabled:opacity-30 sm:h-8 sm:w-8 sm:text-sm"
      >
        −
      </button>
      <input
        type="number"
        value={quantity}
        disabled={disabled}
        onChange={(e) => {
          const val = parseInt(e.target.value, 10);
          if (!isNaN(val)) onChange(Math.min(max, Math.max(min, val)));
        }}
        className="h-11 w-12 border-x border-neutral-300 bg-transparent text-center text-sm dark:border-neutral-700 sm:h-8 sm:w-10"
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={inc}
        disabled={disabled || quantity >= max}
        aria-label="Increase quantity"
        className="flex h-11 w-11 items-center justify-center text-base disabled:opacity-30 sm:h-8 sm:w-8 sm:text-sm"
      >
        +
      </button>
    </div>
  );
}