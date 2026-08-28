import type { Metadata } from 'next';
import { connection } from 'next/server';
import Header from '@/app/components/Header';
import Hero from '@/app/components/Hero';
import Marquee from '@/app/components/Marquee';
import ProductGrid from '@/app/components/ProductGrid';
import Benefits from '@/app/components/Benefits';
import HomepageMerchandising from '@/app/components/HomepageMerchandising';
import Footer from '@/app/components/Footer';
import { getCollectionProducts } from '@/lib/shopify/queries';

export const metadata: Metadata = {
  title: 'ASHPIA CERAMICS',
  description: 'Shop handcrafted ceramic pieces from ASHPIA.',
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  await connection();
  const featuredCollection = await getCollectionProducts('best-seller', 20);
  const mugsCollection = await getCollectionProducts('ceramic-mug', 50);
  
  const mugHandles = new Set((mugsCollection?.products || []).map(p => p.handle));
  const products = (featuredCollection?.products || [])
    .filter(p => !mugHandles.has(p.handle))
    .slice(0, 4);

  const halloweenCollectionData = await getCollectionProducts('halloween', 20);
  let halloweenProducts = halloweenCollectionData?.products || [];
  
  const jackO = halloweenProducts.find(p => p.handle.includes('jack-o'));
  const witch = halloweenProducts.find(p => p.handle.includes('witch'));
  const dracula = halloweenProducts.find(p => p.handle.includes('dracula'));
  const frankenstein = halloweenProducts.find(p => p.title.includes('Frankenstein'));

  const targetedProducts = [jackO, witch, dracula, frankenstein].filter(Boolean) as typeof halloweenProducts;
  
  if (targetedProducts.length === 4) {
    halloweenProducts = targetedProducts;
  } else {
    const targetedIds = new Set(targetedProducts.map(p => p.id));
    const others = halloweenProducts.filter(p => !targetedIds.has(p.id));
    halloweenProducts = [...targetedProducts, ...others].slice(0, 4);
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <ProductGrid
          products={products}
          className="homepage-featured"
          eyebrow="BEST SELLERS"
          title="OUR MOST-LOVED CERAMICS."
          intro="Customer favorites made for everyday use, chosen again and again for their playful details and handmade character."
          ctaHref="/collections/best-seller"
          ctaLabel="SHOP BEST SELLERS →"
        />
        <Benefits />
        {halloweenProducts.length > 0 && (
          <ProductGrid
            products={halloweenProducts}
            className="homepage-halloween"
            eyebrow="HALLOWEEN COLLECTION"
            title="HALLOWEEN CERAMICS FOR SPOOKY SEASON."
            intro="Handmade Halloween pieces with playful characters, warm colors, and everyday function."
            ctaHref="/collections/halloween"
            ctaLabel="SHOP HALLOWEEN →"
          />
        )}
        <HomepageMerchandising mugsProducts={mugsCollection?.products?.slice(0, 4) || []} />
      </main>
      <Footer />
    </>
  );
}
