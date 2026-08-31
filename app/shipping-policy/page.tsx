import type { Metadata } from 'next';
import PolicyPage from '@/app/components/PolicyPage';
import Link from 'next/link';
import { SHIPPING_CONFIG } from '@/lib/config';

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
          title: 'Production & Shipping Timelines',
          body: [
            'Every ASHPIA ceramic piece is uniquely handmade to order. Because of this, production time is required before your item can be shipped.',
            `• Standard: ${SHIPPING_CONFIG.timelines.standard}`,
            `• Priority: ${SHIPPING_CONFIG.timelines.priority}`,
          ],
        },
        {
          title: 'Shipping Rates & Destinations',
          body: [
            SHIPPING_CONFIG.coverageText,
            'We offer free standard shipping to the United States, Canada, the United Kingdom, Australia, and Europe. Available upgraded shipping methods, exact rates, taxes, and duties are calculated in Shopify Checkout based on the delivery address and cart contents.',
          ],
        },
        {
          title: 'International Customs & Duties',
          body: [
            'International orders may be subject to customs duties, import taxes, or local fees charged by the destination country. These charges, if applicable, are the customer\'s responsibility.',
          ],
        },
        {
          title: 'Safe Arrival Guarantee & Delivery Issues',
          body: [
            'If your ceramic item arrives damaged or broken, contact us within 48 hours of delivery with clear photos of the item and the packaging. Once verified, we will send a replacement at no additional cost, including free replacement shipping.',
            'If your shipment appears significantly delayed or lost, please contact us with your order number so we can help track it down.',
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
