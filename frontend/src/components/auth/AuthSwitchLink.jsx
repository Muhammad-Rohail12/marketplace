import Link from 'next/link';

export default function AuthSwitchLink({ prompt, linkLabel, href }) {
  return (
    <p className="text-center text-sm text-neutral-500">
      {prompt}{' '}
      <Link href={href} className="font-medium text-primary-600 hover:underline">{linkLabel}</Link>
    </p>
  );
}