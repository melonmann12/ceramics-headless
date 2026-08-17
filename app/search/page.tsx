import { connection } from 'next/server';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ProductGrid from '@/app/components/ProductGrid';
import CatalogFilters from '@/app/components/CatalogFilters';
import { searchProducts } from '@/lib/shopify/queries';
import { filterAndSortProducts } from '@/lib/catalog-utils';
import type { NormalizedProduct } from '@/lib/shopify/types';
import '@/app/components/CatalogPage.css';

export const metadata = {
  title: 'Search Results',
};

// Next.js App Router Page signature for SearchParams
export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await connection();
  const searchParams = await props.searchParams;
  
  const q = typeof searchParams?.q === 'string' ? searchParams.q : '';
  const sort = typeof searchParams?.sort === 'string' ? searchParams.sort : '';
  const availability = typeof searchParams?.availability === 'string' ? searchParams.availability : '';
  const price = typeof searchParams?.price === 'string' ? searchParams.price : '';

  let products: NormalizedProduct[] = [];
  
  if (q.trim()) {
    // Fetch up to 50 results to allow for robust client-side filtering without pagination complexity for now
    products = await searchProducts(q, 50);
  }

  products = filterAndSortProducts(products, { sort, availability, price });

  return (
    <>
      <Header />
      <main className="catalog-page">
        <div className="catalog-container">
          <header className="catalog-header">
            <h1 className="catalog-title">
              {q ? `Search results for "${q}"` : 'Search'}
            </h1>
            {q && (
              <p className="catalog-count">
                {products.length} {products.length === 1 ? 'result' : 'results'} found
              </p>
            )}
          </header>

          <div className="catalog-controls">
            <CatalogFilters />
          </div>

          {products.length > 0 ? (
            <ProductGrid products={products} title="" className="catalog-product-grid" />
          ) : (
            <div className="catalog-empty">
              <p>No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
