'use client';

import { useState } from 'react';
import Link from 'next/link';
import InfoPage from '@/components/navigation/InfoPage';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return <InfoPage title="Track Your Order" intro="Sign in to view live order details, delivery status, and your complete order history."><form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} className="max-w-md"><Input id="order-number" label="Order number" placeholder="ORD-20260820-00001" value={orderNumber} onChange={(event) => setOrderNumber(event.target.value)} /><Button type="submit" className="mt-3">Find Order</Button></form>{submitted && <p className="max-w-md rounded-md bg-neutral-100 p-4 dark:bg-neutral-800">Order lookup is available from your account. <Link href="/account/orders" className="font-medium text-primary-600 hover:underline">Open your orders</Link>.</p>}<p>Need help? <Link href="/contact" className="text-primary-600 hover:underline">Contact support</Link>.</p></InfoPage>;
}
