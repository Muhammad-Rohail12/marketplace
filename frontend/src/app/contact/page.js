import InfoPage from '@/components/navigation/InfoPage';

export default function ContactPage() {
  return <InfoPage title="Contact Us" intro="We are here to help with orders, products, stores, and account questions."><div className="grid gap-4 sm:grid-cols-3"><div><strong className="text-neutral-900 dark:text-white">Support email</strong><p>support@marketplace.test</p></div><div><strong className="text-neutral-900 dark:text-white">Phone</strong><p>+1 (555) 010-2026</p></div><div><strong className="text-neutral-900 dark:text-white">Hours</strong><p>Mon-Fri, 9 AM-5 PM CT</p></div></div><p>For order questions, include your order number so our support team can find the right details quickly.</p></InfoPage>;
}
