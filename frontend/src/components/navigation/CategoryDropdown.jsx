'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FiGrid, FiChevronDown } from 'react-icons/fi';
import { getNavigationCategories, listCategories } from '@/services/categoryService';

const buildNavigationTree = (items = []) => {
  const byParent = new Map();
  items.forEach((item) => {
    const key = item.parentId ?? 'root';
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(item);
  });

  const attachChildren = (parentId = null) => {
    const children = (byParent.get(parentId ?? 'root') || []).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    return children.map((node) => ({ ...node, children: attachChildren(node.id) }));
  };

  return attachChildren();
};

// Header "All Categories" dropdown — reuses the real Phase 17
// navigation endpoint (already public, already live). Distinct from
// CategoryNavMenu (Phase 17, hover-per-item mega menu) — this is a
// single trigger button opening one flyout, used in the header's
// left-hand category selector slot per the roadmap spec.
export default function CategoryDropdown() {
  const [tree, setTree] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const loadTree = async () => {
      try {
        const navRes = await getNavigationCategories();
        const nextTree = navRes?.data?.tree || [];

        if (Array.isArray(nextTree) && nextTree.length > 0) {
          setTree(nextTree);
          return;
        }

        const fallbackRes = await listCategories({ limit: 200, sort: 'sortOrder:asc' });
        setTree(buildNavigationTree(fallbackRes?.data?.categories || []));
      } catch {
        setTree([]);
      }
    };

    loadTree();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative hidden lg:block">
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        aria-expanded={isOpen}
        className="flex h-10 items-center gap-2 rounded-md border border-neutral-300 px-3 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
      >
        <FiGrid size={16} />
        All Categories
        <FiChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-40 mt-2 w-72 rounded-lg border border-neutral-200 bg-white py-2 shadow-dropdown dark:border-neutral-800 dark:bg-neutral-900">
          {tree.length === 0 ? (
            <p className="px-4 py-3 text-sm text-neutral-500">No categories yet.</p>
          ) : (
            tree.map((node) => (
              <div key={node.id} className="group relative">
                <Link
                  href={`/categories/${node.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  {node.name}
                  {node.children?.length > 0 && <FiChevronDown className="-rotate-90" size={12} />}
                </Link>
                {node.children?.length > 0 && (
                  <div className="invisible absolute left-full top-0 z-10 min-w-45 rounded-lg border border-neutral-200 bg-white py-2 opacity-0 shadow-dropdown transition-opacity group-hover:visible group-hover:opacity-100 dark:border-neutral-800 dark:bg-neutral-900">
                    {node.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/categories/${child.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}