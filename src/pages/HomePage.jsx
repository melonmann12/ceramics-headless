import Header from '../components/Header';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import SubHeader from '../components/SubHeader';
import ProductGrid from '../components/ProductGrid';
import Benefits from '../components/Benefits';
import SocialGallery from '../components/SocialGallery';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <SubHeader />
        <ProductGrid />
        <Benefits />
        <SocialGallery />
      </main>
      <Footer />
    </>
  );
}
