import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './PDP.css';

export default function PDP() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('DESCRIPTION');
  const [activeGlaze, setActiveGlaze] = useState('SAGE');
  const [activeSize, setActiveSize] = useState('300ML');
  const [qty, setQty] = useState(1);

  const glazes = [
    { id: 'SAGE', color: '#1E2E24' },
    { id: 'PEACH', color: '#E5C1B3' },
    { id: 'CREAM', color: '#FDFBF7' },
    { id: 'TERRACOTTA', color: '#C97A63' },
  ];

  const sizes = ['300ML', '450ML'];

  const handleQtyChange = (delta) => {
    setQty(prev => Math.max(1, prev + delta));
  };

  const toggleAccordion = (tab) => {
    setActiveTab(activeTab === tab ? '' : tab);
  };

  const displayTitle = id ? id.replace(/-/g, ' ').toUpperCase() : 'KYOTO DAPPLED CERAMIC BOWL';

  return (
    <div className="pdp-page">
      <Header />
      
      <div className="pdp-content-wrapper">
        <main className="pdp-main">
          {/* LEFT COLUMN */}
          <div className="pdp-left-col">
            <img 
              src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=1200" 
              alt="Matcha Bowl Main" 
              className="pdp-main-image"
            />
            
            <div className="pdp-thumbnail-gallery">
              <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=300" className="pdp-thumbnail active" alt="Thumb 1"/>
              <img src="https://images.unsplash.com/photo-1599422314077-f4dfdaa4cd09?auto=format&fit=crop&q=80&w=300" className="pdp-thumbnail" alt="Thumb 2"/>
              <img src="https://images.unsplash.com/photo-1620189507195-68309c04c4d0?auto=format&fit=crop&q=80&w=300" className="pdp-thumbnail" alt="Thumb 3"/>
              <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300" className="pdp-thumbnail" alt="Thumb 4"/>
            </div>

            <div className="pdp-infographic-grid">
              <div className="pdp-info-card">
                <div className="pdp-info-icon">1</div>
                <h4 className="pdp-info-title">DAPPLED GLAZE</h4>
                <p className="pdp-info-desc">Soft green blended finish with dreamy touch.</p>
              </div>
              <div className="pdp-info-card">
                <div className="pdp-info-icon">2</div>
                <h4 className="pdp-info-title">HAND-FORMED</h4>
                <p className="pdp-info-desc">Hand-sculpted motif with unique expression.</p>
              </div>
              <div className="pdp-info-card">
                <div className="pdp-info-icon">3</div>
                <h4 className="pdp-info-title">SMOOTH RIM</h4>
                <p className="pdp-info-desc">Delicate hand-applied finish around the rim.</p>
              </div>
              <div className="pdp-info-card">
                <div className="pdp-info-icon">4</div>
                <h4 className="pdp-info-title">PRECISE FOOT</h4>
                <p className="pdp-info-desc">Dimensional handmade base.</p>
              </div>
            </div>

            <div className="pdp-handmade-note">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>local_florist</span>
              100% handmade • Slight variations make each piece unique.
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>local_florist</span>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="pdp-right-col">
            <div>
              <h1 className="pdp-title">{displayTitle}</h1>
              <div className="pdp-prices">
                <span className="pdp-price-current">€65.00</span>
                <span className="pdp-price-original">€85.00</span>
              </div>
              
              <div className="pdp-installments">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shopping_bag</span>
                <span>Pay in 4 interest-free installments of €16.25 with shop Pay. <a href="#" style={{textDecoration: 'underline'}}>Learn more</a></span>
              </div>

              <div className="pdp-ratings">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="material-symbols-outlined" style={{ fontSize: '18px' }}>star</span>
                ))}
                <span className="pdp-review-count">(12 reviews)</span>
              </div>
            </div>

            <div className="pdp-selector-section">
              <div className="pdp-selector-header">
                <h4 className="pdp-selector-title">CHOOSE YOUR GLAZE: {activeGlaze}</h4>
              </div>
              <div className="pdp-swatches-grid">
                {glazes.map(glaze => (
                  <div 
                    key={glaze.id} 
                    className={`pdp-swatch-wrapper ${activeGlaze === glaze.id ? 'active' : ''}`}
                    onClick={() => setActiveGlaze(glaze.id)}
                  >
                    <div className="pdp-swatch-color" style={{ backgroundColor: glaze.color }}></div>
                    <span className="pdp-swatch-label">{glaze.id}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pdp-selector-section">
              <div className="pdp-selector-header">
                <h4 className="pdp-selector-title">SELECT SIZE:</h4>
                <a href="#" className="pdp-sizing-link">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>straighten</span>
                  Sizing chart
                </a>
              </div>
              <div className="pdp-pill-swatches">
                {sizes.map(size => (
                  <button 
                    key={size}
                    className={`pdp-pill-swatch ${activeSize === size ? 'active' : ''}`}
                    onClick={() => setActiveSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="pdp-actions-row">
              <div className="pdp-quantity-pill">
                <button className="pdp-qty-btn" onClick={() => handleQtyChange(-1)}>-</button>
                <span className="pdp-qty-value">{qty}</span>
                <button className="pdp-qty-btn" onClick={() => handleQtyChange(1)}>+</button>
              </div>
              <div className="pdp-availability">
                <div className="pdp-availability-dot"></div>
                Only 3 left in stock
              </div>
            </div>

            <button className="pdp-add-to-cart">
              ADD TO CART
            </button>

            <div className="pdp-payment-icons">
              <span className="material-symbols-outlined">credit_card</span>
              <span className="material-symbols-outlined">payments</span>
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>

            <div className="pdp-accordions">
              {['DESCRIPTION', 'ARTISAN STORY', 'SPECS', '2. Production Time', '3. Shipping'].map(tab => (
                <div key={tab} className={`pdp-accordion-item ${activeTab === tab ? 'open' : ''}`}>
                  <div className={`pdp-accordion-header ${activeTab === tab ? 'active' : ''}`} onClick={() => toggleAccordion(tab)}>
                    {tab}
                    <span className="material-symbols-outlined">
                      {activeTab === tab ? 'remove' : 'add'}
                    </span>
                  </div>
                  <div className="pdp-accordion-content">
                    {tab === 'DESCRIPTION' && (
                      <p>
                        A delicate piece crafted from the finest earth.<br/><br/>
                        Molded by hand, fired in silence, meant for reflection.<br/>
                        Each curve tells a story of patience and raw beauty, elevating your daily matcha ritual into a moment of true serenity.
                      </p>
                    )}
                    {tab === 'SPECS' && (
                      <ul>
                        <li>Volume: ~{activeSize}</li>
                        <li>Dimensions: 11cm diameter, 7.5cm height</li>
                        <li>Food safe & lead-free glaze</li>
                        <li>Handwash recommended</li>
                      </ul>
                    )}
                    {tab !== 'DESCRIPTION' && tab !== 'SPECS' && (
                      <p>Details and information regarding {tab.toLowerCase()} for this handcrafted piece. Ships worldwide.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pdp-why-choose-us">
              <h3 className="pdp-wcu-title">Why Choose Us?</h3>
              <div className="pdp-wcu-grid">
                <div className="pdp-wcu-item">
                  <span className="material-symbols-outlined pdp-wcu-icon">local_shipping</span>
                  <span className="pdp-wcu-item-title">FREE SHIPPING</span>
                  <span className="pdp-wcu-item-desc">Delivered with care to your door</span>
                </div>
                <div className="pdp-wcu-item">
                  <span className="material-symbols-outlined pdp-wcu-icon">verified_user</span>
                  <span className="pdp-wcu-item-title">SECURE CHECKOUT</span>
                  <span className="pdp-wcu-item-desc">Safe & reliable payment methods</span>
                </div>
                <div className="pdp-wcu-item">
                  <span className="material-symbols-outlined pdp-wcu-icon">assignment_return</span>
                  <span className="pdp-wcu-item-title">EASY RETURNS</span>
                  <span className="pdp-wcu-item-desc">14 days to return or exchange</span>
                </div>
                <div className="pdp-wcu-item">
                  <span className="material-symbols-outlined pdp-wcu-icon">star</span>
                  <span className="pdp-wcu-item-title">LOVED BY CERAMISTS</span>
                  <span className="pdp-wcu-item-desc">1000+ five-star reviews</span>
                </div>
              </div>
            </div>

            <div className="pdp-review-block">
              <div className="pdp-review-header">
                <div className="pdp-reviewer-avatar">L</div>
                <div>
                  <div className="pdp-reviewer-name">Layla</div>
                  <div className="pdp-ratings">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className="material-symbols-outlined" style={{ fontSize: '14px' }}>star</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="pdp-review-text">"Great craftsmanship, lovely design, and fast shipping. Love it!"</p>
            </div>
          </div>
        </main>

        {/* BOTTOM SECTION */}
        <section className="pdp-curated-set">
          <h2 className="pdp-set-title">COMPLETE THE CEREMONY SET</h2>
          <div className="pdp-set-grid">
            {[1,2,3,4].map(item => (
              <div key={item} className="pdp-mini-card">
                <img src={`https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400&sig=${item}`} alt="Related item" className="pdp-mini-img"/>
                <h4 className="pdp-mini-title">BAMBOO WHISK</h4>
                <div className="pdp-mini-price">€25.00</div>
                <button className="pdp-mini-btn">VIEW PRODUCT</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
