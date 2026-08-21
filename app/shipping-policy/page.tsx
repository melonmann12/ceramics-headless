import type { Metadata } from 'next';
import PolicyPage from '@/app/components/PolicyPage';

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
    />
  );
}
