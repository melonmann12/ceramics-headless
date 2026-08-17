import './SubHeader.css';
import Link from 'next/link';

export default function SubHeader() {
  return (
    <section className="subheader-section">
      <div className="subheader-content">
        <h2 className="subheader-title">
          &quot;A DAILY RITUAL, ELEVATED BY HANDCRAFTED CERAMICS - TACTILE, BALANCED, AND UNIQUE.&quot;
        </h2>
        <Link href="/shop" className="pill-btn pill-btn-outline subheader-link">
          SHOP ALL
        </Link>
      </div>
    </section>
  );
}
