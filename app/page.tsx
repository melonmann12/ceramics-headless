import Header from '@/app/components/Header';
import Hero from '@/app/components/Hero';
import Marquee from '@/app/components/Marquee';
import SubHeader from '@/app/components/SubHeader';
import ProductGrid from '@/app/components/ProductGrid';
import Benefits from '@/app/components/Benefits';
import SocialGallery from '@/app/components/SocialGallery';
import Footer from '@/app/components/Footer';

// Phase 4: import { getProducts } from '@/lib/shopify/queries';

export default async function HomePage() {
  // Phase 4: const products = await getProducts(12);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <SubHeader />
        {/* Phase 4: <ProductGrid products={products} /> */}
        <ProductGrid />
        <Benefits />
        <SocialGallery />
      </main>
      <Footer />
    </>
  );
}
