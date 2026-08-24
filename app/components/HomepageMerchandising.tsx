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
          <p className="section-eyebrow">OUR STORY</p>
          <h2 className="section-title">THE OBJECTS WE LIVE WITH.</h2>
          <p className="section-desc">
            ASHPIA began with a simple idea: the ceramics we use every day can be useful, handmade, and full of personality.
          </p>
          <p className="section-desc">
            What started with two student siblings and a shared love for everyday objects became a small collection of ceramics made to be held, used, and enjoyed every day.
          </p>
          <div className="craft-actions">
            <Link href="/shop" className="pill-btn pill-btn-outline">
              SHOP THE COLLECTION
            </Link>
            <Link href="/about" className="text-link-arrow">
              READ OUR STORY
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
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
        <Link href="/track-order" className="trust-item">
          <span className="material-symbols-outlined">package_2</span>
          <span>
            <strong>Trackable Shipping</strong>
            Once your order is on the way, follow its journey anytime from our Track Order page.
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
