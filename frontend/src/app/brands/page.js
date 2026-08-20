import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { getHomepageBrands, listBrands } from '@/services/brandService';

export default async function BrandsPage() {
  let brands = [];
  try {
    const response = await listBrands({ limit: 100 });
    brands = response.data.brands || [];
  } catch {
    try { brands = (await getHomepageBrands()).data.brands || []; } catch { brands = []; }
  }
  return <MainLayout><main className="container-page py-10"><h1 className="text-3xl font-semibold">Brands</h1><p className="mt-2 text-neutral-500">Explore brands from ZAF Cart sellers.</p>{brands.length ? <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{brands.map((brand) => <Link key={brand.id} href={`/brands/${brand.slug}`} className="rounded-lg border border-neutral-200 p-5 transition hover:border-primary-500 dark:border-neutral-800"><h2 className="font-semibold">{brand.name}</h2><p className="mt-1 text-xs text-neutral-500">Explore products</p></Link>)}</div> : <p className="mt-8 rounded-lg border border-dashed p-6 text-sm text-neutral-500">Brands are loading. Please try again shortly.</p>}</main></MainLayout>;
}
