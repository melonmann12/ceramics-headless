import type { Metadata } from 'next';
import PolicyPage from '@/app/components/PolicyPage';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for the ASHPIA storefront.',
};

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms of Service"
      intro="These terms describe general use of the ASHPIA storefront."
      sections={[
        {
          title: 'Storefront Use',
          body: [
            'Customers may browse products, add available variants to cart, and complete purchases through Shopify-hosted Checkout.',
          ],
        },
        {
          title: 'Product Information',
          body: [
            'Product details, availability, and pricing are provided through Shopify. Handmade ceramics can vary naturally in finish, color, and form.',
          ],
        },
        {
          title: 'Orders and Payment',
          body: [
            'Orders are submitted through Shopify Checkout. Payment, shipping, taxes, and final order totals are confirmed before purchase.',
          ],
        },
        {
          title: 'Policy Changes',
          body: [
            'ASHPIA may update storefront policies as business operations are finalized. Customers should review the policy pages before placing an order.',
          ],
        },
      ]}
    />
  );
}
