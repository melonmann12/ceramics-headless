import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyPage from '@/app/components/PolicyPage';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact ASHPIA about orders, shipping, returns, and product questions.',
};

export default function ContactPage() {
  return (
    <PolicyPage
      title="Contact"
      sections={[
        {
          title: 'Questions about your order, shipping, returns, or product care?',
          body: [
            'Send us a message using the chat button in the bottom-right corner of the page.',
            'For order-related questions, please include your order number so we can help you faster.'
          ],
        },
        {
          title: 'Damaged Items',
          body: [
            'For a damaged or broken item, please contact us within 48 hours of delivery and include clear photos of the item and packaging so we can arrange your free replacement.',
          ],
        },
      ]}
    >
      <section className="policy-section" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(66, 26, 33, 0.04)', borderRadius: 'var(--radius-md)' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Already placed an order?</h2>
        <p style={{ marginBottom: '1rem' }}>Track your shipment for the latest delivery updates.</p>
        <Link 
          href="/track-order" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.35rem', 
            color: 'var(--plum)', 
            fontWeight: 700, 
            fontSize: '0.85rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            textDecoration: 'none' 
          }}
        >
          TRACK YOUR ORDER <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>arrow_forward</span>
        </Link>
      </section>
    </PolicyPage>
  );
}
