import Image from 'next/image';
import './SocialGallery.css';

const images = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC4SXmvhvHeX1JWXVUF30cy5nY3tABJEkjOmKNBBZsbW_thQMUXrHCzTC2d-WFN05gT1hnEfEmEIpCLdqSF3nKhp2cKyBUwpXbvK4vgxnvDjekowI33G12seVu4V2znqR52bkSNfOuyNo2kQ5A_h1NmuBsBAgdV_OPZg2rHibsVPf7_mInFQ1UjX7snWdKi8M5yyLwbem98BfJL8jnSvwmx6bgCnjwAt9t6JLTDzY0ob3V1Jnll4-Ga',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAWM90o-zpJc1-YZRaBifTK9CzHChwgxKLW_SpfVGnxeepKVYuJa6Ji7ht9WO5u38O1JhQf_V2ctqrCnDDwAMWSHutSPTeEz5Ap-OYfWWX_pM9_lvwgavLj0tEIaOsUwpQbqXNPoq2G3kT91S0UwpT-pwVuEYpYpAHLtDc1qFEKyaFa-qWw20yhWlU0BiKKA8uN08X2fxDlmACs5LkzNicT4O68AkcWPwp970XxCy42hMlil0-SzB4-',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBraoMF7WWVqNEHh4c5FNCTq8-GBsQbbCHDfU0t-ZSriVWf4ySGz536WNonJnbRv1pUpYzXiKRItQncFEY3rchq8uuKrJUQJZjzVxvZ5htqV_gt9ATePcyhjO7sb2impoVkDdpebaZ9aRby72wECVt3kvw_i8GelidxTkQiK4JLUblJ5Zh3A8mJfqUsbzKbKk1yTz3EbjbNqynkp50uSecCeYc5_Q4FmIEBDkAt8MusZPc5Lc1-tEC4',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuADadcCbbdG-tQl8fF02Tu2bHYZF4M9yAt8TMPIb09QTaSVqaanHu4PXOnTqnFhWr1fmjg9Zaw7j6zeV5WGLfzro8qxVQyHeD3wcVJBkpAXkFZvlwn8vSZUzdsn6qt7NLUqe5nOP4ddmHoEPa8re9lxsSOUdmSR7yJC6XSWULiqkj38uD5Ll',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDbUdDP7XLIYyqIq4sNX5yI5gPHi_u98EfFnJN6UHfKIx1RpPa6J_b08e5CVR7xrFCzB0nUjUPG5XrAJ6mVPDickP6Ew-V-IN9wQ2vq8wia4469bqQxkwFqJdd4aFeJkk-fJIABD6wQPvVb2JOGR2UHw_VghSfJRrTbWdfop1cd3ZyKYA0fUqglpW1ScWs4cOQUfV4qC0EgrWJhVJYfS0OrYjdkFOSWFmjHC90SVqFHLEkOVIdENZpM'
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
      
      <div className="social-cta">
        <a
          href="https://instagram.com/oura_ceramics"
          className="pill-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          @OURA_CERAMICS
        </a>
      </div>
    </section>
  );
}
