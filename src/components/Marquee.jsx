import './Marquee.css';

export default function Marquee() {
  const content = "• SHIPS WORLDWIDE • FREE SHIPPING OVER €80 • ARTISANAL CERAMICS • HAND-GLAZED IN KILNS • SHIPS IN 24H •";
  
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
