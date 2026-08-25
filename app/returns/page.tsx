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
          title: 'Damaged on Arrival',
          body: [
            'Ceramics should be inspected upon delivery. If an item arrives damaged or broken, please contact us within 48 hours of delivery.',
            'You must provide clear photos of both the damaged ceramic item and the original shipping packaging.',
            'Once the damage is verified, we will send a free replacement item at no additional cost, including free replacement shipping.',
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
