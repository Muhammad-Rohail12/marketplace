import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <FiShoppingCart size={56} className="text-gray-300" />
      <div>
        <h2 className="text-lg font-semibold">Your cart is empty</h2>
        <p className="mt-1 text-sm text-gray-500">You haven&apos;t added anything yet.</p>
      </div>
      <Link href={ROUTES.PRODUCTS}>
        <Button>Continue Shopping</Button>
      </Link>
    </div>
  );
}