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
          title: 'Order Cancellations',
          body: [
            'Because ASHPIA pieces are handmade and often made to order, work on your order may begin shortly after it is placed. If you change your mind, please contact us as soon as possible.',
            'If you request cancellation within 72 hours of placing your order and the order has not been dispatched, you may receive an 80% refund of the eligible product subtotal.',
            'If you request cancellation more than 72 hours after placing your order but before 10 days have passed, and the order has not been dispatched, you may receive a 50% refund of the eligible product subtotal.',
            'Once 10 days have passed from the time the order was placed, voluntary order cancellation is no longer eligible for a refund.',
            'Once an order has been dispatched, it can no longer be cancelled under this pre-dispatch cancellation policy.',
            'This cancellation policy is separate from our damaged-item, shipping, and applicable post-delivery return policies.',
            'Nothing in this voluntary cancellation policy limits any rights you may have under applicable consumer law.',
          ],
        },
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
