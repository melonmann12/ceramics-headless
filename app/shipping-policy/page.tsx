import type { Metadata } from 'next';
import PolicyPage from '@/app/components/PolicyPage';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Shipping information for ASHPIA orders.',
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      title="Shipping Policy"
      intro="This page summarizes how ASHPIA handles order processing and shipping. Final shipping options and costs are shown during Shopify Checkout before payment."
      sections={[
        {
          title: 'Order Processing',
          body: [
            'Orders are prepared after payment is completed. Because ceramics require careful packing, processing details and estimated timelines will be confirmed during checkout.',
          ],
        },
        {
          title: 'Shipping Rates',
          body: [
            'Available shipping methods, rates, taxes, and duties are calculated in Shopify Checkout based on the delivery address and cart contents.',
          ],
        },
        {
          title: 'Delivery Issues',
          body: [
            'If an order arrives damaged or a shipment appears delayed, please contact ASHPIA with your order number and relevant photos.',
          ],
        },
      ]}
    >
      <section className="policy-section">
        <h2>Order Tracking</h2>
        <p>
          Once your order has been shipped, you&apos;ll receive a tracking number by email. You can use this number to follow the latest shipping updates on our Track Order page.
        </p>
        <div style={{ marginTop: '1rem' }}>
          <Link href="/track-order" style={{ textDecoration: 'underline', color: 'var(--sage)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            TRACK YOUR ORDER <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_forward</span>
          </Link>
        </div>
      </section>
    </PolicyPage>
  );
}
