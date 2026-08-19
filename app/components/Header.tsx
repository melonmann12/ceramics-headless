'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, openCart } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className={`header-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container" style={{ position: 'relative' }}>
        <button 
          className="mobile-menu-btn" 
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="material-symbols-outlined">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>

        <Link href="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <Image src="/logo/ashpialogo.png" alt="Ashpia" width={120} height={37} priority className="header-logo-img" />
        </Link>

        <div className="nav-links">
          <Link href="/shop" className={`nav-link ${pathname === '/shop' ? 'active' : ''}`}>SHOP ALL</Link>
          <Link href="/shipping-policy" className={`nav-link ${pathname === '/shipping-policy' ? 'active' : ''}`}>SHIPPING</Link>
          <Link href="/returns" className={`nav-link ${pathname === '/returns' ? 'active' : ''}`}>RETURNS</Link>
          <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>CONTACT</Link>
        </div>

        <div className="nav-icons">
          <button className="icon-btn" aria-label="Search products" onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}>
            <span className="material-symbols-outlined">search</span>
          </button>
          <button className="icon-btn" aria-label="Shopping bag" onClick={() => { openCart(); setMobileMenuOpen(false); }}>
            <span className="material-symbols-outlined">shopping_bag</span>
            {cart && cart.totalQuantity > 0 && (
              <span className="cart-badge">{cart.totalQuantity}</span>
            )}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          <Link href="/shop" className={`mobile-nav-link ${pathname === '/shop' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>SHOP ALL</Link>
          <Link href="/shipping-policy" className={`mobile-nav-link ${pathname === '/shipping-policy' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>SHIPPING</Link>
          <Link href="/returns" className={`mobile-nav-link ${pathname === '/returns' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>RETURNS</Link>
          <Link href="/contact" className={`mobile-nav-link ${pathname === '/contact' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>CONTACT</Link>
        </div>
      </div>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />
    </nav>
  );
}
