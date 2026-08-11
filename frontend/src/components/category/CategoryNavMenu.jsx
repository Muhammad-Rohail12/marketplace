'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getNavigationCategories } from '@/services/categoryService';

// Simple dropdown-on-hover top-level nav — will slot into the main
// Navbar once category browsing pages exist; not wired into Navbar
// yet since /categories/:slug pages are out of this phase's scope.
export default function CategoryNavMenu() {
  const [tree, setTree] = useState([]);

  useEffect(() => {
    getNavigationCategories()
      .then((res) => setTree(res.data.tree))
      .catch(() => setTree([]));
  }, []);

  if (!tree.length) return null;

  return (
    <nav aria-label="Category navigation" className="flex gap-4">
      {tree.map((node) => (
        <div key={node.id} className="group relative">
          <Link href={`/categories/${node.slug}`} className="text-sm font-medium hover:text-primary-600">
            {node.name}
          </Link>
          {node.children?.length > 0 && (
            <div className="invisible absolute left-0 top-full z-20 min-w-[180px] rounded-md border border-gray-200 bg-white py-2 opacity-0 shadow-dropdown transition-opacity group-hover:visible group-hover:opacity-100 dark:border-gray-800 dark:bg-gray-900">
              {node.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/categories/${child.slug}`}
                  className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}