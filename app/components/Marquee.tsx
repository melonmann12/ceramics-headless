import './Marquee.css';

export default function Marquee() {
  const content = "• HANDCRAFTED CERAMICS • SHOPIFY CHECKOUT • REAL PRODUCT AVAILABILITY • CAREFULLY PACKED ORDERS •";
  
  return (
    <div className="ticker-wrapper marquee-container">
      <div className="ticker-content">
        <span className="marquee-text-block">{content}</span>
        <span className="marquee-text-block">{content}</span>
        <span className="marquee-text-block">{content}</span>
        <span className="marquee-text-block">{content}</span>
      </div>
    </div>
  );
}
