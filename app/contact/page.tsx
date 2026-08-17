import type { Metadata } from 'next';
import PolicyPage from '@/app/components/PolicyPage';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact OURA CERAMICS about orders, shipping, returns, and product questions.',
};

export default function ContactPage() {
  return (
    <PolicyPage
      title="Contact"
      intro="For order questions, shipping issues, returns, or product care questions, contact details should be added here before launch."
      note="Launch item: no support email or contact service is configured in the project. Add a real monitored support email before sending paid traffic."
      sections={[
        {
          title: 'Order Support',
          body: [
            'Customers should include their order number and the email address used at checkout when requesting help.',
          ],
        },
        {
          title: 'Damaged Items',
          body: [
            'For damaged ceramic items, customers should keep the packaging and provide clear photos so the issue can be reviewed.',
          ],
        },
      ]}
    />
  );
}
