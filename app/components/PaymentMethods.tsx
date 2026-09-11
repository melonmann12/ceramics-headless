import React from 'react';
import './PaymentMethods.css';

const paymentMethods = [
  { name: 'Visa', src: '/payment-logos/cards/visa.svg' },
  { name: 'Mastercard', src: '/payment-logos/cards/mastercard.svg' },
  { name: 'American Express', src: '/payment-logos/cards/american-express.svg' },
  { name: 'Discover', src: '/payment-logos/cards/discover.svg' },
  { name: 'Diners Club', src: '/payment-logos/cards/diners.svg' },
  { name: 'Elo', src: '/payment-logos/cards/elo.svg' },
  { name: 'JCB', src: '/payment-logos/cards/jcb.svg' },
  { name: 'UnionPay', src: '/payment-logos/cards/unionpay.svg' },
  { name: 'Apple Pay', src: '/payment-logos/wallets/apple-pay.svg' },
  { name: 'Google Pay', src: '/payment-logos/wallets/google-pay.svg' },
  { name: 'PayPal', src: '/payment-logos/apm/paypal.svg' },
  { name: 'Shop Pay', src: '/payment-logos/wallets/shop-pay.svg' },
];

export default function PaymentMethods() {
  return (
    <div className="payment-methods" aria-label="Accepted Payment Methods">
      {paymentMethods.map((method) => (
        <div key={method.name} className="payment-method-badge" title={method.name}>
          <img src={method.src} alt={`${method.name} logo`} />
        </div>
      ))}
    </div>
  );
}
