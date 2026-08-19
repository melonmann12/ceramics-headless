import Image from 'next/image';
import Link from 'next/link';
import './HomepageMerchandising.css';

export default function HomepageMerchandising() {
  return (
    <>
      <section className="craft-section">
        <div className="craft-media">
          <Image
            src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=85&w=1400"
            alt="Ceramic pieces arranged in soft natural light"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            loading="eager"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="craft-copy">
          <p className="section-eyebrow">PRODUCT PHILOSOPHY</p>
          <h2 className="section-title">The weight of daily objects.</h2>
          <p className="section-desc">
            A ceramic piece is used before it is displayed. OURA CERAMICS chooses pieces for the way they meet the hand, serve a daily purpose, and bring visual quiet to your home.
          </p>
          <Link href="/shop" className="pill-btn pill-btn-outline">
            SHOP THE COLLECTION
          </Link>
        </div>
      </section>

      <section className="ritual-section" aria-labelledby="ritual-title">
        <div className="ritual-inner">
          <p className="section-eyebrow">DAILY USE</p>
          <h2 id="ritual-title">Morning routines, slow afternoons, and pieces chosen for the hand.</h2>
          <p className="ritual-desc">
            Explore ceramic forms that turn daily moments into a small pause: prepare, hold, use, and return the piece to the shelf for tomorrow.
          </p>
        </div>
      </section>

      <section className="trust-strip" aria-label="Store confidence links">
        <Link href="/shop" className="trust-item">
          <span className="material-symbols-outlined">inventory_2</span>
          <span>
            <strong>Live Catalog</strong>
            Products and availability come from Shopify.
          </span>
        </Link>
        <Link href="/shipping-policy" className="trust-item">
          <span className="material-symbols-outlined">local_shipping</span>
          <span>
            <strong>Shipping Information</strong>
            Rates are shown in Shopify Checkout before payment.
          </span>
        </Link>
        <Link href="/returns" className="trust-item">
          <span className="material-symbols-outlined">assignment_return</span>
          <span>
            <strong>Returns Information</strong>
            Review current return guidance before ordering.
          </span>
        </Link>
        <Link href="/contact" className="trust-item">
          <span className="material-symbols-outlined">mail</span>
          <span>
            <strong>Contact</strong>
            Find what to include for order or product questions.
          </span>
        </Link>
      </section>

      <section className="final-cta-section">
        <h2>Find the pieces for your daily rituals.</h2>
        <Link href="/shop" className="pill-btn">
          SHOP ALL
        </Link>
      </section>
    </>
  );
}
