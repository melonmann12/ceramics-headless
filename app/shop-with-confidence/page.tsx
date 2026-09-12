import type { Metadata } from 'next';
import PolicyPage from '@/app/components/PolicyPage';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shop With Confidence | ASHPIA',
  description: 'Learn why you can shop with confidence at ASHPIA. We are a registered U.S. business offering secure checkout, tracked shipping, and safe arrival support for our handmade ceramics.',
};

export default function ShopWithConfidencePage() {
  return (
    <PolicyPage
      title="SHOP WITH CONFIDENCE"
      updated=""
      sections={[
        {
          title: 'FIRST TIME SHOPPING WITH ASHPIA?',
          body: [
            'We know ordering handmade pieces from a small online studio can feel unfamiliar. That’s why we want to be transparent about who we are, how your payment is handled, how your order is shipped, and what happens if something goes wrong.',
          ],
        },
        {
          title: 'REGISTERED U.S. BUSINESS',
          body: [
            'ASHPIA is operated by Dang Tran LLC, a registered U.S. business in Wyoming, USA.',
            'We believe customers should know who they are purchasing from, which is why our business information is publicly available on our website.',
          ],
        },
        {
          title: 'SECURE SHOPIFY CHECKOUT',
          body: [
            'Your checkout is securely processed through Shopify. ASHPIA does not directly handle or store your full payment card details.',
            'We support trusted payment methods including major credit cards, PayPal, Apple Pay, Google Pay, Shop Pay, and other available payment providers.',
          ],
        },
        {
          title: 'TRACKED SHIPPING',
          body: [
            'Once your handmade order has been completed and dispatched, you will receive tracking information so you can follow its journey.',
            'Because our ceramic pieces are handmade and made to order, preparation may take longer than mass-produced products. We aim to make this clear before purchase.',
          ],
        },
        {
          title: 'SAFE ARRIVAL SUPPORT',
          body: [
            'Ceramics are fragile, and although every order is carefully packed, damage during transit can occasionally happen.',
            'If your item arrives damaged, contact us within 48 hours of delivery and include clear photos of the item and packaging. We’ll review the issue and help arrange an appropriate resolution, including replacement where applicable.',
          ],
        },
        {
          title: 'HANDMADE, NOT MASS-PRODUCED',
          body: [
            'Every ASHPIA piece is handmade, so small variations in glaze, color, shape, or detailing are part of the character of handmade ceramics.',
            'These natural differences do not mean your item is defective; they make each piece unique.',
          ],
        },
        {
          title: 'NEED HELP?',
          body: [
            'If you have a question before or after placing an order, you can contact us through our Contact page.',
            <Link 
              key="contact-link"
              href="/contact" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.35rem', 
                color: 'var(--plum)', 
                fontWeight: 700, 
                fontSize: '0.85rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                textDecoration: 'none',
                marginTop: '0.5rem'
              }}
            >
              CONTACT ASHPIA <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>arrow_forward</span>
            </Link>
          ],
        },
      ]}
    />
  );
}
