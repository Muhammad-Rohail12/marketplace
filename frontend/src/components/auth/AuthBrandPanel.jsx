import { FiShield, FiTruck, FiUsers } from 'react-icons/fi';

const POINTS = [
  { icon: FiShield, text: 'Secure, encrypted account protection' },
  { icon: FiTruck, text: 'Fast shipping across the United States' },
  { icon: FiUsers, text: 'Thousands of trusted sellers, one marketplace' },
];

export default function AuthBrandPanel() {
  return (
    <div className="flex h-full flex-col justify-between bg-linear-to-br from-primary-800 to-neutral-900 p-12 text-white">
      <div>
        <h1 className="text-3xl font-bold leading-tight text-balance">
          Everything you need, all in one marketplace.
        </h1>
        <p className="mt-3 max-w-sm text-white/70">
          Join a growing community of shoppers and sellers across the US.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {POINTS.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Icon size={16} />
            </span>
            <span className="text-sm text-white/85">{text}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-white/40">© {new Date().getFullYear()} Marketplace, Inc.</p>
    </div>
  );
}