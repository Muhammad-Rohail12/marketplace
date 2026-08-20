'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Rating from '@/components/ui/Rating';
import Skeleton from '@/components/ui/Skeleton';
import Tabs from '@/components/ui/Tabs';
import Accordion, { AccordionItem } from '@/components/ui/Accordion';
import Modal from '@/components/ui/Modal';
import Drawer from '@/components/ui/Drawer';
import { useToast } from '@/context/ToastContext';
import { useModal } from '@/hooks/useModal';
import { useState } from 'react';

const COLOR_GROUPS = ['primary', 'secondary', 'accent', 'success', 'danger', 'warning', 'neutral'];

export default function DesignSystemPage() {
  const { showToast } = useToast();
  const modal = useModal(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="container-page flex flex-col gap-10 py-10">
      <h1 className="text-3xl font-semibold">Design System Reference</h1>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase text-neutral-500">Colors</h2>
        {COLOR_GROUPS.map((group) => (
          <div key={group} className="mb-2 flex items-center gap-2">
            <span className="w-20 text-xs">{group}</span>
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div key={shade} className={`h-8 w-8 rounded bg-${group}-${shade}`} title={`${group}-${shade}`} />
            ))}
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase text-neutral-500">Buttons</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="link">Link</Button>
          <Button isLoading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className="grid max-w-md gap-4">
        <h2 className="text-sm font-semibold uppercase text-neutral-500">Form Elements</h2>
        <Input id="ds-input" label="Text input" placeholder="Type here..." />
        <Select id="ds-select" label="Select" options={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]} />
        <Checkbox id="ds-check" label="Checkbox option" />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase text-neutral-500">Badges & Rating</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="neutral">Neutral</Badge>
          <Rating value={4.5} count={128} />
        </div>
      </section>

      <section className="grid max-w-sm gap-3">
        <h2 className="text-sm font-semibold uppercase text-neutral-500">Card & Skeleton</h2>
        <Card interactive>Interactive card — hover me</Card>
        <Skeleton className="h-24 w-full" />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase text-neutral-500">Tabs</h2>
        <Tabs
          tabs={[
            { value: 'one', label: 'Overview', content: <p className="text-sm">Overview content.</p> },
            { value: 'two', label: 'Details', content: <p className="text-sm">Details content.</p> },
          ]}
        />
      </section>

      <section className="max-w-md">
        <h2 className="mb-3 text-sm font-semibold uppercase text-neutral-500">Accordion</h2>
        <Accordion>
          <AccordionItem title="Shipping details">Ships in 3-7 business days.</AccordionItem>
          <AccordionItem title="Return policy">30-day returns.</AccordionItem>
        </Accordion>
      </section>

      <section className="flex flex-wrap gap-2">
        <h2 className="w-full text-sm font-semibold uppercase text-neutral-500">Overlays</h2>
        <Button onClick={() => showToast('This is a success toast', 'success')}>Show Success Toast</Button>
        <Button onClick={() => showToast('This is an error toast', 'error')}>Show Error Toast</Button>
        <Button onClick={modal.open}>Open Modal</Button>
        <Button onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
      </section>

      <Modal isOpen={modal.isOpen} onClose={modal.close} title="Example Modal">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Modal body content goes here.</p>
      </Modal>

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Example Drawer">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Drawer content — used for mobile nav/filters in later phases.</p>
      </Drawer>
    </div>
  );
}