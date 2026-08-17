'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cart, openCart } = useCart();
  const pathname = usePathname();

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
          <Link href="/shop" className={`nav-link ${pathname === '/shop' ? 'active' : ''}`}>SHOP ALL</Link>
          <Link href="/shipping-policy" className={`nav-link ${pathname === '/shipping-policy' ? 'active' : ''}`}>SHIPPING</Link>
          <Link href="/returns" className={`nav-link ${pathname === '/returns' ? 'active' : ''}`}>RETURNS</Link>
          <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>CONTACT</Link>
        </div>

        <div className="nav-icons">
          <button className="icon-btn" aria-label="Search products" onClick={() => setSearchOpen(true)}>
            <span className="material-symbols-outlined">search</span>
          </button>
          <button className="icon-btn" aria-label="Shopping bag" onClick={openCart}>
            <span className="material-symbols-outlined">shopping_bag</span>
            {cart && cart.totalQuantity > 0 && (
              <span className="cart-badge">{cart.totalQuantity}</span>
            )}
          </button>
        </div>
      </div>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />
    </nav>
  );
}
