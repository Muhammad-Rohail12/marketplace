'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { cn } from '@/utils/cn';

function TreeNode({ node, depth = 0, linkBase = '/categories', renderActions }) {
  const [expanded, setExpanded] = useState(depth === 0);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-1 py-1"
        style={{ paddingLeft: `${depth * 16}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-label={expanded ? 'Collapse' : 'Expand'}
            className="text-gray-400 hover:text-gray-600"
          >
            {expanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
          </button>
        ) : (
          <span className="inline-block w-[14px]" />
        )}

        <Link href={`${linkBase}/${node.slug}`} className="flex-1 text-sm hover:text-primary-600">
          {node.name}
        </Link>

        {renderActions && renderActions(node)}
      </div>

      {hasChildren && expanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} linkBase={linkBase} renderActions={renderActions} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryTree({ tree = [], linkBase = '/categories', renderActions, className = '' }) {
  return (
    <div className={cn('flex flex-col', className)}>
      {tree.map((node) => (
        <TreeNode key={node.id} node={node} linkBase={linkBase} renderActions={renderActions} />
      ))}
    </div>
  );
}