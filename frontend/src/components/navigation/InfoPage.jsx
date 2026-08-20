import MainLayout from '@/components/layout/MainLayout';

export default function InfoPage({ title, intro, children }) {
  return (
    <MainLayout>
      <main className="container-page py-10">
        <div className="max-w-3xl">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-primary-600">Marketplace</p>
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">{title}</h1>
          <p className="mt-3 text-neutral-600 dark:text-neutral-300">{intro}</p>
          <div className="mt-8 flex flex-col gap-6 text-sm leading-7 text-neutral-600 dark:text-neutral-300">{children}</div>
        </div>
      </main>
    </MainLayout>
  );
}
