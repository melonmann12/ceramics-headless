'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-section">
      <div className="footer-container">
        
        <div className="footer-content">
          {/* Left Side: Navigation Columns */}
          <div className="footer-nav-wrapper">
            <div className="footer-nav-col">
              <div className="footer-heading">
                <Image src="/logo/ashpialogo.png" alt="Ashpia" width={100} height={31} className="footer-logo-img" />
              </div>
              <div className="footer-links">
                <Link href="/" className="footer-link">HOME</Link>
                <Link href="/shop" className="footer-link">SHOP ALL</Link>
                <Link href="/contact" className="footer-link">CONTACT</Link>
              </div>
            </div>
            
            <div className="footer-nav-col">
              <div className="footer-links">
                <Link href="/shipping-policy" className="footer-link">SHIPPING</Link>
                <Link href="/returns" className="footer-link">RETURNS</Link>
                <Link href="/privacy-policy" className="footer-link">PRIVACY</Link>
                <Link href="/terms" className="footer-link">TERMS</Link>
              </div>
            </div>
          </div>

          <div className="footer-newsletter-wrapper">
            <div className="footer-care-card">
              <h3 className="footer-care-heading">CUSTOMER CARE</h3>
              <p className="footer-care-text">Questions about an order, shipping, returns, or product care?</p>
              <Link href="/contact" className="footer-care-link">
                MESSAGE US
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <span className="material-symbols-outlined footer-copyright-logo">local_cafe</span>
            <span>© 2026 ASHPIA. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </div>

      <button 
        className={`back-to-top ${showTopBtn ? 'visible' : ''}`} 
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        ↑ Back to Top
      </button>
    </footer>
  );
}
