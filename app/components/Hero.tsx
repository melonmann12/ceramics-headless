import Image from 'next/image';
import Link from 'next/link';
import './Hero.css';

export default function Hero() {
  return (
    <header className="hero-section">
      <div className="hero-background">
        <Image 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLCFQVhXe57-dOU0kgXerLw8dOY8xHZ1lNUN0rqalM21h0xs7n0TqODg1_jEreH04h-irbDj96NeLjvP7lqCbAXZYGhMGF9ZxO6pBFDGHugqF7rffuATaYxs6Tu_y8I2soIg36keqc7AfEFcQqjZxQjatgtd-YFni7cV8mywxWGPJ1osGcd_sJOvK0dB4mv2sgCY4IwMRoFX4ABNLyz5a2rql6r5OR15iT40WBT9bcjuVI1kWhoQP3" 
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
