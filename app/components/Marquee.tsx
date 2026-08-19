import './Marquee.css';

export default function Marquee() {
  const content = "• ASHPIA • CERAMICS FOR DAILY USE • HANDMADE CERAMICS • THOUGHTFUL FORMS • PIECES FOR THE HOME ";
  
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
