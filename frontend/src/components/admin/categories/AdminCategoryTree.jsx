'use client';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import CategoryTree from '@/components/category/CategoryTree';

export default function AdminCategoryTree({ tree, onEdit, onDelete, onRestore }) {
  return (
    <CategoryTree
      tree={tree}
      linkBase="#" // admin view doesn't navigate away on click
      renderActions={(node) => (
        <div className="flex items-center gap-2">
          {!node.isActive && <Badge variant="warning">Inactive</Badge>}
          {node.deletedAt && <Badge variant="danger">Deleted</Badge>}
          {node.isFeatured && <Badge variant="primary">Featured</Badge>}
          {node.deletedAt ? (
            <Button variant="ghost" size="sm" onClick={() => onRestore(node)}>
              Restore
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => onEdit(node)}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(node)}>
                Delete
              </Button>
            </>
          )}
        </div>
      )}
    />
  );
}