'use client';

import { useEffect, useState } from 'react';
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
              <h4 className="footer-heading">OURA CERAMICS</h4>
              <div className="footer-links">
                <a href="/#bestsellers" className="footer-link">SHOP ALL</a>
                <a href="/story" className="footer-link">OUR STORY</a>
                <a href="/blog" className="footer-link">JOURNAL</a>
              </div>
            </div>
            
            <div className="footer-nav-col">
              <h4 className="footer-heading">HELP</h4>
              <div className="footer-links">
                <a href="/faq" className="footer-link">FAQ</a>
                <a href="/shipping" className="footer-link">SHIPPING</a>
                <a href="/returns" className="footer-link">RETURNS</a>
                <a href="/contact" className="footer-link">CONTACT</a>
              </div>
            </div>
          </div>

          {/* Right Side: Newsletter Card Container */}
          <div className="footer-newsletter-wrapper">
            <div className="newsletter-card">
              <h3 className="newsletter-heading">JOIN THE CERAMIC COMMUNITY AND ENJOY 10% OFF</h3>
              <p className="newsletter-subtext">Sign up for exclusive launch updates, special offers, and ceramic care tips. Plus, enjoy a discount on your first order!</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Email address" className="newsletter-input" />
                <button className="newsletter-submit" aria-label="Subscribe">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <span className="material-symbols-outlined footer-copyright-logo">local_cafe</span>
            <span>© 2026 OURA CERAMICS. ALL RIGHTS RESERVED.</span>
          </div>
          <div className="footer-social-icons">
            <a href="https://instagram.com" className="icon-btn" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined">camera_alt</span>
            </a>
            <a href="https://tiktok.com" className="icon-btn" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined">play_circle</span>
            </a>
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
