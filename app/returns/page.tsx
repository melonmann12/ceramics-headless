import type { Metadata } from 'next';
import PolicyPage from '@/app/components/PolicyPage';

export const metadata: Metadata = {
  title: 'Returns & Refunds',
  description: 'Returns and refunds information for OURA CERAMICS orders.',
};

export default function ReturnsPage() {
  return (
    <PolicyPage
      title="Returns & Refunds"
      intro="This page outlines the returns structure for OURA CERAMICS. Specific eligibility rules must be confirmed by the store owner before launch."
      note="Launch item: add the confirmed return window, refund conditions, damaged-item process, and support email."
      sections={[
        {
          title: 'Return Requests',
          body: [
            'Customers should contact OURA CERAMICS before sending any item back. Return eligibility depends on the final store policy and the condition of the item.',
          ],
        },
        {
          title: 'Damaged Items',
          body: [
            'Ceramics should be inspected on delivery. If an item arrives damaged, customers should keep the packaging and provide clear photos with their order details.',
          ],
        },
        {
          title: 'Refunds',
          body: [
            'Approved refunds are processed back to the original payment method through Shopify. Payment provider processing times may vary.',
          ],
        },
      ]}
    />
  );
}
