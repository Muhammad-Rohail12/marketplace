'use client';

export default function QuantitySelector({ quantity, onChange, min = 1, max = 999, disabled = false }) {
  const dec = () => onChange(Math.max(min, quantity - 1));
  const inc = () => onChange(Math.min(max, quantity + 1));

  return (
    <div className="flex items-center rounded-md border border-gray-300 dark:border-gray-700">
      <button
        type="button"
        onClick={dec}
        disabled={disabled || quantity <= min}
        aria-label="Decrease quantity"
        className="px-2 py-1 text-sm disabled:opacity-30"
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
        className="w-10 border-x border-gray-300 bg-transparent text-center text-sm dark:border-gray-700"
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={inc}
        disabled={disabled || quantity >= max}
        aria-label="Increase quantity"
        className="px-2 py-1 text-sm disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}