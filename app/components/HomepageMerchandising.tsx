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
            alt="Ceramic bowls arranged in soft natural light"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            loading="eager"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="craft-copy">
          <p className="section-eyebrow">PRODUCT PHILOSOPHY</p>
          <h2>Texture, form, and the pace of preparation.</h2>
          <p>
            A matcha bowl is used before it is displayed. OURA CERAMICS chooses pieces for the way they meet the hand, hold space for the whisk, and bring visual quiet to a daily ritual.
          </p>
          <Link href="/shop" className="pill-btn pill-btn-outline">
            SHOP MATCHA BOWLS
          </Link>
        </div>
      </section>

      <section className="ritual-section" aria-labelledby="ritual-title">
        <div className="ritual-inner">
          <p className="section-eyebrow">DAILY USE</p>
          <h2 id="ritual-title">Morning matcha, slow afternoons, and bowls chosen for the hand.</h2>
          <p>
            Explore ceramic forms that turn preparation into a small pause: measure, whisk, hold, sip, and return the bowl to the shelf for tomorrow.
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
        <h2>Find the bowl for your daily matcha ritual.</h2>
        <Link href="/shop" className="pill-btn">
          SHOP ALL
        </Link>
      </section>
    </>
  );
}
