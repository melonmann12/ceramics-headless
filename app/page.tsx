import type { Metadata } from 'next';
import { connection } from 'next/server';
import Header from '@/app/components/Header';
import Hero from '@/app/components/Hero';
import ProductGrid from '@/app/components/ProductGrid';
import Benefits from '@/app/components/Benefits';
import HomepageMerchandising from '@/app/components/HomepageMerchandising';
import Footer from '@/app/components/Footer';
import { getProducts } from '@/lib/shopify/queries';

export const metadata: Metadata = {
  title: 'Handcrafted Matcha Bowls',
  description: 'Shop handcrafted ceramic matcha bowls from OURA CERAMICS.',
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  await connection();
  const products = await getProducts(4);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProductGrid
          products={products}
          className="homepage-featured"
          eyebrow="FEATURED CERAMICS"
          title="Ceramics chosen for daily use, not display alone."
          intro="OURA CERAMICS focuses on rounded forms, textured surfaces, and bowls that make a quiet matcha ritual feel grounded in the hand."
          ctaHref="/shop"
          ctaLabel="SHOP ALL"
        />
        <Benefits />
        <HomepageMerchandising />
      </main>
      <Footer />
    </>
  );
}
