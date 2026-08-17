import Image from 'next/image';
import './Benefits.css';

const benefitsData = [
  {
    title: 'SHAPED FOR BETTER WHISKING',
    description: 'Wide bases and curved walls are selected for daily matcha preparation and comfortable whisking.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=900&sig=benefit-1'
  },
  {
    title: 'MADE TO FEEL GOOD IN YOUR HANDS',
    description: 'Tactile textures and rounded forms are chosen for a grounded, two-handed tea ritual.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=900&sig=benefit-2'
  },
  {
    title: 'ONE-OF-A-KIND CERAMIC CHARACTER',
    description: 'Handmade ceramics can vary naturally in finish, color, and form, giving each piece its own character.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=900&sig=benefit-3'
  }
];

export default function Benefits() {
  return (
    <section className="benefits-section">
      <h2 className="benefits-header">THE ART OF CERAMICS</h2>
      
      <div className="benefits-grid">
        {benefitsData.map((item, index) => (
          <div key={index} className="benefit-item">
            <div className="benefit-image-container">
              <Image
                src={item.image}
                alt={item.title}
                width={600}
                height={600}
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h3 className="benefit-title">{item.title}</h3>
            <p className="benefit-description">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
