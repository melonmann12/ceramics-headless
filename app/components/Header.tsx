'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
        <Link href="/" className="brand-logo">OURA CERAMICS</Link>

        <div className="nav-links">
          <Link href="/#bestsellers" className="nav-link active">SHOP ALL</Link>
          <Link href="/story" className="nav-link">OUR STORY</Link>
          <Link href="/blog" className="nav-link">BLOG</Link>
          <Link href="/b2b" className="nav-link">B2B</Link>
        </div>

        <div className="nav-icons">
          <button className="icon-btn" aria-label="Search">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button className="icon-btn" aria-label="Account">
            <span className="material-symbols-outlined">person</span>
          </button>
          <button className="icon-btn relative" aria-label="Shopping bag">
            <span className="material-symbols-outlined">shopping_bag</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
