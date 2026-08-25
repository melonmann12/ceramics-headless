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
  const [productsExpanded, setProductsExpanded] = useState(false);
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
          <Link href="/collections/matcha-set" className={`nav-link ${pathname === '/collections/matcha-set' ? 'active' : ''}`}>MATCHA SET</Link>
          <Link href="/collections/ceramic-mug" className={`nav-link ${pathname === '/collections/ceramic-mug' ? 'active' : ''}`}>MUGS</Link>
          <div className="nav-dropdown-container">
            <button className="nav-link nav-dropdown-toggle">COLLECTIONS ▾</button>
            <div className="nav-dropdown-menu">
              <Link href="/collections/matcha-set" className="nav-dropdown-item">MATCHA SET</Link>
              <Link href="/collections/ceramic-mug" className="nav-dropdown-item">CERAMIC MUGS</Link>
              <Link href="/collections/halloween" className="nav-dropdown-item">HALLOWEEN</Link>
            </div>
          </div>
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
          <Link href="/collections/matcha-set" className={`mobile-nav-link ${pathname === '/collections/matcha-set' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>MATCHA SET</Link>
          <Link href="/collections/ceramic-mug" className={`mobile-nav-link ${pathname === '/collections/ceramic-mug' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>MUGS</Link>
          <div className="mobile-nav-item-group">
            <button 
              className="mobile-nav-link mobile-dropdown-toggle" 
              onClick={() => setProductsExpanded(!productsExpanded)}
            >
              COLLECTIONS {productsExpanded ? '▴' : '▾'}
            </button>
            {productsExpanded && (
              <div className="mobile-nav-subitems">
                <Link href="/collections/matcha-set" className="mobile-nav-sublink" onClick={() => setMobileMenuOpen(false)}>MATCHA SET</Link>
                <Link href="/collections/ceramic-mug" className="mobile-nav-sublink" onClick={() => setMobileMenuOpen(false)}>CERAMIC MUGS</Link>
                <Link href="/collections/halloween" className="mobile-nav-sublink" onClick={() => setMobileMenuOpen(false)}>HALLOWEEN</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />
    </nav>
  );
}
