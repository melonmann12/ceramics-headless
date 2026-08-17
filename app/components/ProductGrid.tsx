import Link from 'next/link';
import Image from 'next/image';
import type { NormalizedProduct } from '@/lib/shopify/types';
import './ProductGrid.css';

interface ProductGridProps {
  products: NormalizedProduct[];
  title?: string;
}

export default function ProductGrid({ products, title }: ProductGridProps) {
  return (
    <section className="products-section" id="bestsellers">
      <div className="container">
        {title && <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2rem', letterSpacing: '0.05em' }}>{title}</h2>}
        
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', fontSize: '1.2rem', color: '#5C635B' }}>
            No products available at the moment. Please check back later!
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => {
              const href = `/product/${product.handle}`;
              
              return (
                <div key={product.id} className="product-card">
                  <Link href={href} className="product-link">
                    <div className="product-image-wrapper">
                      {product.badge && <span className="product-badge">{product.badge}</span>}
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.title}
                          className="product-image"
                          width={600}
                          height={600}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="product-image-placeholder">Product image unavailable</div>
                      )}
                    </div>
                    <div className="product-info">
                      <h3 className="product-title">{product.title}</h3>
                      <p className="product-price">
                        {product.compareAtPrice && (
                          <span className="price-original">{product.compareAtPrice}</span>
                        )}
                        {product.price}
                      </p>
                    </div>
                  </Link>
                  <div className="product-actions">
                    <Link
                      href={href}
                      className="add-to-cart-btn"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>shopping_bag</span>
                      {product.availableForSale ? 'VIEW OPTIONS' : 'OUT OF STOCK'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
