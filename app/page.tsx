import type { Metadata } from 'next';
import { connection } from 'next/server';
import Header from '@/app/components/Header';
import Hero from '@/app/components/Hero';
import Marquee from '@/app/components/Marquee';
import SubHeader from '@/app/components/SubHeader';
import ProductGrid from '@/app/components/ProductGrid';
import Benefits from '@/app/components/Benefits';
import SocialGallery from '@/app/components/SocialGallery';
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
        <Marquee />
        <SubHeader />
        <ProductGrid products={products} className="homepage-featured" />
        <Benefits />
        <SocialGallery />
      </main>
      <Footer />
    </>
  );
}
