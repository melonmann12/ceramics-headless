import Image from 'next/image';
import './SocialGallery.css';

const images = [
  'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=700&sig=gallery-1',
  'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=700&sig=gallery-2',
  'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=700&sig=gallery-3',
  'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=700&sig=gallery-4',
  'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=700&sig=gallery-5'
];

export default function SocialGallery() {
  return (
    <section className="social-section">
      <h2 className="social-header">JOURNEY IN CLAY</h2>
      
      <div className="social-gallery hide-scrollbar">
        {images.map((img, idx) => (
          <div key={idx} className="social-item">
            <Image
              src={img}
              alt={`Social gallery image ${idx + 1}`}
              width={400}
              height={400}
              sizes="(max-width: 768px) 80vw, 20vw"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
