import type { Metadata } from 'next';
import { connection } from 'next/server';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ProductGrid from '@/app/components/ProductGrid';
import { getProducts } from '@/lib/shopify/queries';

export const metadata: Metadata = {
  title: 'Shop All',
  description: 'Browse our collection of handcrafted ceramic matcha bowls and ritual tools.',
  alternates: {
    canonical: '/shop',
  },
};

export default async function ShopPage() {
  await connection();
  const products = await getProducts(24);

  return (
    <>
      <Header />
      <main style={{ paddingTop: '100px', paddingBottom: '40px' }}>
        <ProductGrid products={products} title="SHOP ALL" />
      </main>
      <Footer />
    </>
  );
}
