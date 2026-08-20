'use client';

import Drawer from '@/components/ui/Drawer';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import CategorySidebarFilters from './CategorySidebarFilters';
import { FiSliders } from 'react-icons/fi';

export default function MobileFilterDrawer({ isOpen, onOpen, onClose, resultCount, activeCount = 0, ...filterProps }) {
  return (
    <>
      <Button variant="outline" size="sm" onClick={onOpen} className="flex items-center gap-2 lg:hidden">
        <FiSliders size={14} /> Filters
        {activeCount > 0 && <Badge variant="primary">{activeCount}</Badge>}
      </Button>

      <Drawer isOpen={isOpen} onClose={onClose} side="left" title={`Filters (${resultCount})`}>
        <CategorySidebarFilters {...filterProps} />
        <Button onClick={onClose} className="mt-6 w-full">Show {resultCount} results</Button>
      </Drawer>
    </>
  );
}