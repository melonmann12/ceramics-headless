import type { Metadata } from 'next';
import { connection } from 'next/server';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ProductGrid from '@/app/components/ProductGrid';
import CatalogFilters from '@/app/components/CatalogFilters';
import { getProducts } from '@/lib/shopify/queries';
import { filterAndSortProducts } from '@/lib/catalog-utils';
import { getJudgeMeRatingsMap } from '@/lib/judgeme/client';
import '@/app/components/CatalogPage.css';

export const metadata: Metadata = {
  title: 'Shop All',
  description: 'Browse our collection of handcrafted ceramic pieces and functional objects.',
  alternates: {
    canonical: '/shop',
  },
};

export default async function ShopPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await connection();
  const searchParams = await props.searchParams;
  
  const sort = typeof searchParams?.sort === 'string' ? searchParams.sort : 'highest-rated';
  const availability = typeof searchParams?.availability === 'string' ? searchParams.availability : '';
  const price = typeof searchParams?.price === 'string' ? searchParams.price : '';

  const ratingsMap = await getJudgeMeRatingsMap();
  let products = await getProducts(100);
  products = filterAndSortProducts(products, { sort, availability, price }, ratingsMap);

  return (
    <>
      <Header />
      <main className="catalog-page">
        <div className="catalog-container">
          <header className="catalog-header">
            <h1 className="catalog-title">SHOP ALL</h1>
            <p className="catalog-count">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </p>
          </header>

          <div className="catalog-controls">
            <CatalogFilters />
          </div>

          <ProductGrid products={products} title="" className="catalog-product-grid" />
        </div>
      </main>
      <Footer />
    </>
  );
}
