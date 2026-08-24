import Link from 'next/link';
import './Benefits.css';

const benefitsData = [
  {
    title: 'BALANCED FOR THE HAND',
    description: 'Rounded silhouettes and considered proportions make each piece feel calm to hold and easy to return to.',
  },
  {
    title: 'DESIGNED FOR DAILY USE',
    description: 'The collection centers handcrafted ceramic pieces meant for everyday life and quiet use.',
  },
  {
    title: 'CURRENT AVAILABILITY',
    description: 'Browse the collection with confidence knowing that inventory and availability are always up to date.',
  },
  {
    title: 'CLEAR POLICIES',
    description: 'Review shipping, returns, privacy, and terms transparently before placing your order.',
  },
];

export default function Benefits() {
  return (
    <section className="benefits-section">
      <div className="benefits-heading-block">
        <p className="benefits-eyebrow">WHY ASHPIA</p>
        <h2 className="benefits-header">A calmer way to choose handmade ceramics.</h2>
      </div>
      
      <div className="benefits-grid">
        {benefitsData.map((item) => (
          <div key={item.title} className="benefit-item">
            <h3 className="benefit-title">{item.title}</h3>
            <p className="benefit-description">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="benefits-policy-links" aria-label="Store policy links">
        <Link href="/shipping-policy">Shipping information</Link>
        <Link href="/returns">Returns information</Link>
        <Link href="/contact">Contact support</Link>
      </div>
    </section>
  );
}
