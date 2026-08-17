import Link from 'next/link';
import './Benefits.css';

const IconBowl = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12c0 4.418 3.582 8 8 8s8-3.582 8-8" />
    <path d="M2 12h20" />
  </svg>
);

const IconCup = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <path d="M6 1v3" />
    <path d="M10 1v3" />
    <path d="M14 1v3" />
  </svg>
);

const IconBox = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="M3.27 6.96L12 12.01l8.73-5.05" />
    <path d="M12 22.08V12" />
  </svg>
);

const IconShield = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const benefitsData = [
  {
    icon: <IconBowl />,
    title: 'BALANCED FOR THE HAND',
    description: 'Rounded silhouettes and considered proportions make each bowl feel calm to hold and easy to return to.',
  },
  {
    icon: <IconCup />,
    title: 'MADE FOR MATCHA RITUALS',
    description: 'The collection centers matcha bowls and ceramic pieces meant for everyday preparation and quiet use.',
  },
  {
    icon: <IconBox />,
    title: 'CURRENT AVAILABILITY',
    description: 'Browse the collection with confidence knowing that inventory and availability are always up to date.',
  },
  {
    icon: <IconShield />,
    title: 'CLEAR POLICIES',
    description: 'Review shipping, returns, privacy, and terms transparently before placing your order.',
  },
];

export default function Benefits() {
  return (
    <section className="benefits-section">
      <div className="benefits-heading-block">
        <p className="benefits-eyebrow">WHY OURA CERAMICS</p>
        <h2 className="benefits-header">A calmer way to choose matcha ware.</h2>
      </div>
      
      <div className="benefits-grid">
        {benefitsData.map((item) => (
          <div key={item.title} className="benefit-item">
            <span className="benefit-icon">{item.icon}</span>
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
