import type { Metadata } from 'next';
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
            'For damaged ceramic items, please keep the packaging and provide clear photos so the issue can be reviewed.',
          ],
        },
      ]}
    />
  );
}
