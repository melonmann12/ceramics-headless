import type { Metadata } from 'next';
import { connection } from 'next/server';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ProductGrid from '@/app/components/ProductGrid';
import CatalogFilters from '@/app/components/CatalogFilters';
import { getCollectionProducts } from '@/lib/shopify/queries';
import { filterAndSortProducts } from '@/lib/catalog-utils';
import { getJudgeMeRatingsMap } from '@/lib/judgeme/client';
import Pagination from '@/app/components/Pagination';
import '@/app/components/CatalogPage.css';

interface CollectionPageProps {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { handle } = await params;
  const collectionData = await getCollectionProducts(handle);
  
  if (!collectionData) return { title: 'Collection Not Found' };

  return {
    title: collectionData.title,
    description: `Shop the ${collectionData.title} collection at Ashpia Ceramics.`,
  };
}

export default async function CollectionPage(props: CollectionPageProps) {
  await connection();
  const { handle } = await props.params;
  const searchParams = await props.searchParams;
  
  const sort = typeof searchParams?.sort === 'string' ? searchParams.sort : 'highest-rated';
  const availability = typeof searchParams?.availability === 'string' ? searchParams.availability : '';
  const price = typeof searchParams?.price === 'string' ? searchParams.price : '';

  const collectionData = await getCollectionProducts(handle);
  
  if (!collectionData) {
    return (
      <>
        <Header />
        <main className="catalog-page" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
          <h1>Collection Not Found</h1>
          <p>Could not find a Shopify collection with handle "{handle}".</p>
        </main>
        <Footer />
      </>
    );
  }

  const ratingsMap = await getJudgeMeRatingsMap();
  let products = filterAndSortProducts(collectionData.products, { sort, availability, price }, ratingsMap);

  const PAGE_SIZE = 48;
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / PAGE_SIZE) || 1;
  
  let page = parseInt(typeof searchParams?.page === 'string' ? searchParams.page : '1', 10);
  if (isNaN(page) || page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedProducts = products.slice(startIndex, endIndex);

  return (
    <>
      <Header />
      <main className="catalog-page">
        <div className="catalog-container">
          <header className="catalog-header">
            <h1 className="catalog-title">{collectionData.title.toUpperCase()}</h1>
            <p className="catalog-count">
              {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found
            </p>
          </header>

          <div className="catalog-controls">
            <CatalogFilters />
          </div>

          <ProductGrid products={paginatedProducts} title="" className="catalog-product-grid" />
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      </main>
      <Footer />
    </>
  );
}
