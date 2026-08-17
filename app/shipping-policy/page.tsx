import type { Metadata } from 'next';
import PolicyPage from '@/app/components/PolicyPage';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Shipping information for OURA CERAMICS orders.',
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      title="Shipping Policy"
      intro="This page summarizes how OURA CERAMICS handles order processing and shipping. Final shipping options and costs are shown during Shopify Checkout before payment."
      note="Launch item: add confirmed shipping regions, carrier names, processing time, and support email before paid traffic begins."
      sections={[
        {
          title: 'Order Processing',
          body: [
            'Orders are prepared after payment is completed. Because ceramics require careful packing, processing details should be confirmed by the store owner before launch.',
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
            'If an order arrives damaged or a shipment appears delayed, customers should contact OURA CERAMICS with the order number and relevant photos. A support email still needs to be added.',
          ],
        },
      ]}
    />
  );
}
