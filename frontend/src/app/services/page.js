import InfoPage from '@/components/navigation/InfoPage';

export default function ServicesPage() {
  return <InfoPage title="ZAF Cart Services" intro="Simple tools for shopping, selling, delivery, and support."><div className="grid gap-4 sm:grid-cols-2"><div><h2 className="font-semibold text-neutral-900 dark:text-white">Product discovery</h2><p>Search, browse categories, compare sellers, and save products for later.</p></div><div><h2 className="font-semibold text-neutral-900 dark:text-white">Seller storefronts</h2><p>Independent sellers can manage products, inventory, prices, and orders.</p></div><div><h2 className="font-semibold text-neutral-900 dark:text-white">Secure checkout</h2><p>Use saved addresses, shipping choices, and a clear order summary.</p></div><div><h2 className="font-semibold text-neutral-900 dark:text-white">Order support</h2><p>Review order history and follow delivery status from your account.</p></div></div></InfoPage>;
}
