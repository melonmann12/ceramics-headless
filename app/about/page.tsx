import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import './About.css';

export const metadata: Metadata = {
  title: 'About ASHPIA | Handmade Ceramics for Everyday Use',
  description: 'ASHPIA was started by two student siblings to create beautiful, 100% handmade ceramics designed for real everyday use. Food-safe, small-batch, and full of character.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <Header />
      <main>
        {/* SECTION 1 - HERO */}
        <section className="about-hero-section">
          <div className="about-hero-background">
            <Image
              src="/aboutus/about us.png"
              alt="Handmade ceramics by ASHPIA"
              fill
              sizes="100vw"
              priority
              quality={90}
            />
          </div>
          <div className="about-hero-overlay"></div>
          <div className="about-hero-content">
            <h1 className="about-hero-title">EVERYDAY CERAMICS, MADE A LITTLE MORE PERSONAL.</h1>
            <p className="about-hero-subtitle">
              ASHPIA began with two siblings, two students, and a shared love for the small ceramic objects that quietly become part of everyday life.
            </p>
          </div>
        </section>

        {/* SECTION 2 - OUR STORY */}
        <section className="about-story-section">
          <div className="about-story-inner">
            <h2>OUR STORY</h2>
            <p>
              ASHPIA was started by two siblings who are both university students. The idea came from noticing how familiar ceramic objects, such as bowls, cups, matcha pieces, and small objects around the home, can make ordinary routines feel warmer and more personal.
            </p>
            <p>
              We began to notice how much personality a small handmade object could bring to an ordinary moment. That became the core idea behind ASHPIA: to create ceramics that feel warm, playful, and personal. We wanted to build pieces that are meant to be held, used, and loved, rather than simply left on a shelf for display.
            </p>
          </div>
        </section>

        {/* SECTION 3 - MADE FOR EVERYDAY LIFE */}
        <section className="about-handmade-section">
          <div className="about-handmade-inner">
            <h2>MADE FOR EVERYDAY LIFE</h2>
            <p>
              Our ceramics are made to be used, not only displayed.
            </p>
            <p>
              Bowls, cups, and food-contact pieces are finished with food-safe glaze so they can be part of normal everyday eating and drinking. 
              Handmade pieces may vary slightly in shape, glaze, and finish. That is part of what makes each one individual.
            </p>
          </div>
        </section>

        {/* SECTION 5 - OUR PROMISE */}
        <section className="about-promise-section">
          <h2 className="about-promise-title">OUR PROMISE</h2>
          <div className="about-promise-grid">
            <div className="promise-card">
              <h3>100% HANDMADE</h3>
              <p>Each piece is individually crafted by hand with care and intention.</p>
            </div>
            
            <div className="promise-card">
              <h3>FOOD-SAFE CERAMIC</h3>
              <p>Our glazed ceramics are made to be used for food and drinks as part of everyday routines.</p>
            </div>
            
            <div className="promise-card">
              <h3>CAREFULLY CHECKED</h3>
              <p>Each piece is thoroughly inspected for quality before packing and shipping.</p>
            </div>
            
            <div className="promise-card">
              <h3>PACKED WITH CARE</h3>
              <p>Ceramics are fragile, so every order is packed carefully to help protect them during transit.</p>
            </div>

            <div className="promise-card" style={{ gridColumn: '1 / -1', maxWidth: '500px', margin: '0 auto' }}>
              <h3>SAFE ARRIVAL GUARANTEE</h3>
              <p>
                If an item arrives broken or damaged, contact us within 48 hours. Once verified, we will send a free replacement at no extra cost according to our <Link href="/returns">damage policy</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 6 - FINAL CTA */}
        <section className="about-cta-section">
          <h2>FIND A PIECE FOR YOUR EVERYDAY.</h2>
          <p>Handmade ceramics designed to be held, used, and returned to every day.</p>
          <Link href="/shop" className="pill-btn">
            SHOP THE COLLECTION
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
