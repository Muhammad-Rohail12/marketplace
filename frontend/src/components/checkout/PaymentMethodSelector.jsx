'use client';

import { useState } from 'react';
import { FiCreditCard, FiDollarSign } from 'react-icons/fi';
import Input from '@/components/ui/Input';
import { cn } from '@/utils/cn';

// FRONTEND UI ONLY — no payment gateway/backend exists yet (planned
// for Phase 61: Payment Integration). Card fields are validated for
// FORMAT only, client-side, and nothing is transmitted anywhere —
// this component's sole job is to require a real, deliberate
// selection before "Place Order" is enabled, and to clearly label
// that no charge occurs. Orders are created with paymentStatus:
// PENDING (Phase 30's real, honest default) regardless of what's
// selected here.
const METHODS = [
  { value: 'CARD', label: 'Credit / Debit Card', icon: FiCreditCard },
  { value: 'COD', label: 'Cash on Delivery', icon: FiDollarSign },
];

function luhnCheck(num) {
  const digits = num.replace(/\D/g, '');
  if (digits.length < 13) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = parseInt(digits[i], 10);
    if (shouldDouble) { digit *= 2; if (digit > 9) digit -= 9; }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export default function PaymentMethodSelector({ selectedMethod, onSelectMethod, cardDetails, onCardDetailsChange, errors }) {
  const [touched, setTouched] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">Payment Method</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {METHODS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => onSelectMethod(value)}
            className={cn(
              'flex items-center gap-2 rounded-lg border p-3 text-left text-sm',
              selectedMethod === value ? 'border-primary-600 bg-primary-50 dark:bg-primary-500/10' : 'border-neutral-200 dark:border-neutral-800'
            )}
          >
            <Icon size={18} className={selectedMethod === value ? 'text-primary-600' : 'text-neutral-400'} />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      {selectedMethod === 'CARD' && (
        <div className="grid gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <Input
            id="card-number"
            label="Card number"
            placeholder="4111 1111 1111 1111"
            value={cardDetails.number}
            onChange={(e) => onCardDetailsChange({ ...cardDetails, number: e.target.value })}
            onBlur={() => setTouched(true)}
            error={touched && cardDetails.number && !luhnCheck(cardDetails.number) ? 'Enter a valid card number' : errors.number}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="card-expiry"
              label="Expiry (MM/YY)"
              placeholder="MM/YY"
              value={cardDetails.expiry}
              onChange={(e) => onCardDetailsChange({ ...cardDetails, expiry: e.target.value })}
              error={errors.expiry}
            />
            <Input
              id="card-cvc"
              label="CVC"
              placeholder="123"
              value={cardDetails.cvc}
              onChange={(e) => onCardDetailsChange({ ...cardDetails, cvc: e.target.value })}
              error={errors.cvc}
            />
          </div>
          <p className="text-2xs text-neutral-400">Payment processing is not yet active — no charge will be made. Card details are not stored or transmitted.</p>
        </div>
      )}

      {selectedMethod === 'COD' && (
        <p className="rounded-md bg-neutral-50 p-3 text-xs text-neutral-500 dark:bg-neutral-900">
          Pay with cash when your order is delivered. Available on eligible US orders.
        </p>
      )}
    </div>
  );
}

export function validateCardDetails(details) {
  const errors = {};
  if (!luhnCheck(details.number || '')) errors.number = 'Enter a valid card number';
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(details.expiry || '')) errors.expiry = 'Use MM/YY format';
  if (!/^\d{3,4}$/.test(details.cvc || '')) errors.cvc = 'Enter a valid CVC';
  return { isValid: Object.keys(errors).length === 0, errors };
}