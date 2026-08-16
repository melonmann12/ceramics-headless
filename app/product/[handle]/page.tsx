import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ProductForm from './ProductForm';
import './PDP.css';

// Phase 4: import { getProductByHandle } from '@/lib/shopify/queries';
// Phase 5: import { generateStaticParams } from '@/lib/shopify/queries';

interface PageProps {
  params: Promise<{ handle: string }>;
}

// Phase 4: export async function generateStaticParams() {
//   const products = await getProducts();
//   return products.map((p) => ({ handle: p.handle }));
// }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  // Phase 4: replace with real Shopify product data
  const title = handle.replace(/-/g, ' ').toUpperCase();
  return {
    title,
    description: `Shop the ${title} — handcrafted ceramic matcha bowl by OURA CERAMICS.`,
    openGraph: {
      title,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=1200',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

const thumbnails = [
  'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1599422314077-f4dfdaa4cd09?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1620189507195-68309c04c4d0?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300',
];

const relatedItems = [1, 2, 3, 4];

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params;

  // Phase 4: const product = await getProductByHandle(handle);
  // Phase 4: if (!product) notFound();

  const displayTitle = handle.replace(/-/g, ' ').toUpperCase();
  const price = '€65.00';
  const compareAtPrice = '€85.00';

  return (
    <div className="pdp-page">
      <Header />

      <div className="pdp-content-wrapper">
        <main className="pdp-main">
          {/* LEFT COLUMN — static content, Server Component */}
          <div className="pdp-left-col">
            <Image
              src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=1200"
              alt={`${displayTitle} — Main product image`}
              className="pdp-main-image"
              width={1200}
              height={1200}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            <div className="pdp-thumbnail-gallery">
              {thumbnails.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  className={`pdp-thumbnail${i === 0 ? ' active' : ''}`}
                  alt={`Product thumbnail ${i + 1}`}
                  width={300}
                  height={300}
                  sizes="25vw"
                />
              ))}
            </div>



            <div className="pdp-handmade-note">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>local_florist</span>
              100% handmade • Slight variations make each piece unique.
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>local_florist</span>
            </div>
          </div>

          {/* RIGHT COLUMN — Client Component for all interactivity */}
          <ProductForm
            productTitle={displayTitle}
            price={price}
            compareAtPrice={compareAtPrice}
          />
        </main>

        {/* BOTTOM SECTION — static, Server Component */}
        <section className="pdp-curated-set">
          <h2 className="pdp-set-title">COMPLETE THE CEREMONY SET</h2>
          <div className="pdp-set-grid">
            {relatedItems.map((item) => (
              <div key={item} className="pdp-mini-card">
                <Image
                  src={`https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400&sig=${item}`}
                  alt="Related ceramic item"
                  className="pdp-mini-img"
                  width={400}
                  height={400}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <h4 className="pdp-mini-title">BAMBOO WHISK</h4>
                <div className="pdp-mini-price">€25.00</div>
                <button className="pdp-mini-btn">VIEW PRODUCT</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
