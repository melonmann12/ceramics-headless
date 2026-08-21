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
          title: 'Order Support',
          body: [
            'Please include your order number and the email address used at checkout when requesting help.',
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
