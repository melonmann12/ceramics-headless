import { useEffect, useState } from 'react';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`header-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <a href="#" className="brand-logo">OURA CERAMICS</a>

        <div className="nav-links">
          <a href="#" className="nav-link active">SHOP ALL</a>
          <a href="#" className="nav-link">OUR STORY</a>
          <a href="#" className="nav-link">BLOG</a>
          <a href="#" className="nav-link">B2B</a>
        </div>

        <div className="nav-icons">
          <button className="icon-btn">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button className="icon-btn">
            <span className="material-symbols-outlined">person</span>
          </button>
          <button className="icon-btn relative">
            <span className="material-symbols-outlined">shopping_bag</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
