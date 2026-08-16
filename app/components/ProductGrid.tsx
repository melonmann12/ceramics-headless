import Link from 'next/link';
import Image from 'next/image';
import './ProductGrid.css';

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  reviews: number;
  image: string;
}

// Static fallback data — will be replaced by Shopify Storefront API data in Phase 4
const staticProducts: Product[] = [
  {
    id: 'sage-cloud-ceramic-matcha-bowl',
    title: 'SAGE CLOUD CERAMIC MATCHA BOWL',
    price: 38.00,
    badge: 'BESTSELLER',
    reviews: 12,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDe_IWfUtUEnJZGV0eB-C2Y5mxXWoe4tdQbGOXeyz_zEPxmvb6vJCcqRrZQcpITiTb5ZvmA_6cHiZubopmqhQlgn5ZGDEiHUbS-PFIko8rh0uptWKuQLqpo5QzCTq5p-mHAgX_sZqZm-KvDsmMqyMwK40UjDXGi7Jn1JYGzxQ5nL02iA7visGdXXSmq0lXaqjSkXxr36K0glNM8jg214xlOjzn7FGvm_1P2UQl6ZZSAkNQN5Hlg_PFd'
  },
  {
    id: 'everyday-matcha-ritual-set',
    title: 'EVERYDAY MATCHA RITUAL SET',
    price: 72.00,
    originalPrice: 85.00,
    badge: 'SET',
    reviews: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8OEPY75x-xMumZooYMAqfuJwDbvWABINlDc2Kelhor-ly_9s1bj3wGDSXqtj5GWZopyGEDBcYcJ0CA-dZVSvMiKm5PIXg-Swz8Fk0uov9TB8BXJIR8QGc-biOiKWSTMAXInnEHw4kIRPBYTI7i1rizAqZUYWUPeRaApY_a8j9ESUncp0n0IaIQrtVnk0JbT1hK4FIch_hD8Vh3s5opHwl7yeZkB3uNpgJahcTNS1Fh5uOzSb_OnK3'
  },
  {
    id: 'kyoto-dappled-bowl',
    title: 'KYOTO DAPPLED BOWL',
    price: 42.00,
    badge: 'NEW IN',
    reviews: 4,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0meNkrtB4tv5vUFYJXf4nxOpybFFR7lZZzyxHKOYya045o6n-TIJEW2YVgM-jGbrLKJO5YBGN3VoTnA6cn3vUvuv_54aoCznrq-_5UqWgT3ZSMLnWaokxeX90YY_zkizuClNbq6YMQ4Ogxn_mz8-0mX__Xnh4ZqMUcjTkcMqmyTcjrYeLRk879EPLen1pbt-QBtb28DtWVmDOq08LXpW-BM_5RqzJBMiOGWFhuKa2L49MmXZ_8Oqh'
  }
];

interface ProductGridProps {
  products?: Product[];
}

export default function ProductGrid({ products = staticProducts }: ProductGridProps) {
  return (
    <section className="products-section" id="bestsellers">
      <div className="container">
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <Link href={`/product/${product.id}`} className="product-link">
                <div className="product-image-wrapper">
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                  <Image
                    src={product.image}
                    alt={product.title}
                    className="product-image"
                    width={600}
                    height={600}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="product-info">
                  <div className="product-reviews">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined star-icon" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                    <span className="review-count">{product.reviews} reviews</span>
                  </div>
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-price">
                    {product.originalPrice && (
                      <span className="price-original">€{product.originalPrice.toFixed(2)}</span>
                    )}
                    €{product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
              <div className="product-actions">
                <button className="add-to-cart-btn">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>shopping_bag</span>
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
