import Link from 'next/link';
import Card from '@/components/ui/Card';

export default function AdminStatCard({ label, value, href, icon: Icon, tone = 'text-primary-600' }) {
  return (
    <Link href={href}>
      <Card interactive className="flex items-center gap-3">
        {Icon && <Icon size={20} className={`shrink-0 ${tone}`} />}
        <div>
          <p className="text-xl font-semibold">{value}</p>
          <p className="text-xs text-neutral-500">{label}</p>
        </div>
      </Card>
    </Link>
  );
}