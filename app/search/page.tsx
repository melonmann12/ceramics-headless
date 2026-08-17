import { connection } from 'next/server';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ProductGrid from '@/app/components/ProductGrid';
import SearchFilters from '@/app/components/SearchFilters';
import { searchProducts } from '@/lib/shopify/queries';
import type { NormalizedProduct } from '@/lib/shopify/types';

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

  // 1. Filter by Availability
  if (availability === 'in-stock') {
    products = products.filter(p => p.availableForSale);
  }

  // 2. Filter by Price Range
  if (price) {
    products = products.filter(p => {
      // price string looks like "₫500,000" or "€50.00". We can parse the numeric part.
      // But actually, we don't have the raw numeric price on NormalizedProduct except inside `variants`.
      // Let's grab the first variant's raw price for accurate filtering.
      const rawPrice = parseFloat(p.variants[0]?.price.amount || '0');
      // Note: The thresholds depend on currency. Assuming EUR for the "Under 50" logic as per filter labels.
      // If store is in VND (₫500,000 is ~20 EUR), we might need to adjust or keep it simple.
      // The prompt suggests "Price range", we'll implement simple numeric bounds based on the raw float.
      if (price === 'under-50') return rawPrice < 50;
      if (price === '50-100') return rawPrice >= 50 && rawPrice <= 100;
      if (price === 'over-100') return rawPrice > 100;
      return true;
    });
  }

  // 3. Sort Results
  if (sort === 'price-asc') {
    products.sort((a, b) => {
      const priceA = parseFloat(a.variants[0]?.price.amount || '0');
      const priceB = parseFloat(b.variants[0]?.price.amount || '0');
      return priceA - priceB;
    });
  } else if (sort === 'price-desc') {
    products.sort((a, b) => {
      const priceA = parseFloat(a.variants[0]?.price.amount || '0');
      const priceB = parseFloat(b.variants[0]?.price.amount || '0');
      return priceB - priceA;
    });
  }
  // Relevance (default) is already the order returned by Shopify's search algorithm.

  return (
    <>
      <Header />
      <main className="container" style={{ paddingTop: '100px', paddingBottom: '40px', minHeight: '60vh' }}>
        <h1 style={{ marginBottom: '1rem' }}>
          {q ? `Search results for "${q}"` : 'Search'}
        </h1>
        
        {q && (
          <p style={{ marginBottom: '2rem', color: 'var(--sage)' }}>
            {products.length} {products.length === 1 ? 'result' : 'results'} found
          </p>
        )}

        <SearchFilters />

        {products.length > 0 ? (
          <ProductGrid products={products} title="" />
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--plum)' }}>
            <p>No products found matching your criteria.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
