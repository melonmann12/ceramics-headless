import type { Metadata } from 'next';
import PolicyPage from '@/app/components/PolicyPage';

export const metadata: Metadata = {
  title: 'Returns & Refunds',
  description: 'Returns and refunds information for ASHPIA orders.',
};

export default function ReturnsPage() {
  return (
    <PolicyPage
      title="Returns & Refunds"
      intro="This page outlines the returns structure for ASHPIA."
      sections={[
        {
          title: 'Return Requests',
          body: [
            'Please contact ASHPIA before sending any item back. Return eligibility depends on the condition of the item and our active return window.',
          ],
        },
        {
          title: 'Damaged Items',
          body: [
            'Ceramics should be inspected on delivery. If an item arrives damaged, please keep the packaging and provide clear photos with your order details.',
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
