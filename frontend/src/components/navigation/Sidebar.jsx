import Link from 'next/link';

export default function Sidebar({ links = [], title }) {
  return (
    <aside className="w-full shrink-0 border-r border-gray-200 p-4 md:w-56 dark:border-gray-800">
      {title && <h2 className="mb-3 text-sm font-semibold uppercase text-gray-500">{title}</h2>}
      <nav aria-label={title || 'Sidebar navigation'}>
        <ul className="flex flex-col gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}