import { FiTrendingUp, FiUsers, FiDollarSign } from 'react-icons/fi';

const BENEFITS = [
  { icon: FiUsers, title: 'Reach More Customers', desc: 'Tap into a growing ZAF Cart audience.' },
  { icon: FiDollarSign, title: 'Keep More of What You Earn', desc: 'Transparent, competitive seller fees.' },
  { icon: FiTrendingUp, title: 'Grow With Real Tools', desc: 'Inventory, pricing, and order management built in.' },
];

export default function BecomeSellerHero() {
  return (
    <div className="rounded-xl bg-gradient-to-br from-primary-700 to-neutral-900 p-8 text-white sm:p-12">
      <h1 className="max-w-lg text-3xl font-bold text-balance sm:text-4xl">Start selling on ZAF Cart</h1>
      <p className="mt-2 max-w-md text-white/80">Join thousands of sellers reaching customers across the United States.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {BENEFITS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col gap-2">
            <Icon size={22} />
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-white/70">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}