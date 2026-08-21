import Image from 'next/image';
import Link from 'next/link';
import './Hero.css';

export default function Hero() {
  return (
    <header className="hero-section">
      <div className="hero-background">
        <Image 
          src="/homepage/homepage.png" 
          alt="Overhead flat-lay composition of colorful, textured handcrafted ceramic pieces"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <h1 className="hero-title">HANDMADE CERAMICS FOR EVERYDAY USE</h1>
        <p className="hero-subtitle">Tactile forms for using, holding, and bringing visual quiet to your daily routines.</p>
        <div className="hero-actions">
          <Link href="/shop" className="pill-btn">
            SHOP ALL
          </Link>
        </div>
      </div>
    </header>
  );
}
