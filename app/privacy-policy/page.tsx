import type { Metadata } from 'next';
import PolicyPage from '@/app/components/PolicyPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy information for ASHPIA customers.',
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="ASHPIA uses Shopify to operate the storefront, cart, and checkout. This policy should be reviewed by the business owner or legal advisor before launch."
      note="Launch item: add the legal business entity, contact email, jurisdiction, and any region-specific privacy disclosures."
      sections={[
        {
          title: 'Information Collected',
          body: [
            'When customers browse, add items to cart, or check out, Shopify and the storefront may process information needed to provide ecommerce services, including cart contents, device information, shipping details, and payment-related data.',
          ],
        },
        {
          title: 'How Information Is Used',
          body: [
            'Customer information is used to process orders, provide checkout, calculate shipping and taxes, communicate about orders, prevent fraud, and operate the storefront.',
          ],
        },
        {
          title: 'Service Providers',
          body: [
            'Shopify provides the commerce platform and hosted checkout. Additional providers may be added by the business for shipping, analytics, support, or email once configured.',
          ],
        },
        {
          title: 'Customer Requests',
          body: [
            'Customers may request access, correction, or deletion of personal information where applicable. A support email must be added before launch so customers can submit these requests.',
          ],
        },
      ]}
    />
  );
}
