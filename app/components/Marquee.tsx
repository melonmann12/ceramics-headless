import './Marquee.css';

export default function Marquee() {
  const content = "• OURA CERAMICS • CERAMICS FOR DAILY RITUALS • MATCHA BOWLS • THOUGHTFUL FORMS • MADE FOR THE DAILY MATCHA RITUAL ";
  
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
