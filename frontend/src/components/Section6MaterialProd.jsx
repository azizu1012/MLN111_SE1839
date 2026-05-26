import React from 'react';

export default function Section6MaterialProd({ data, onOpenGame, onOpenGift }) {
  if (!data) return null;

  // Separate cards for asymmetric layout mirroring the screenshot
  const card1 = data.cards.find(c => c.id === '01');
  const card2 = data.cards.find(c => c.id === '02');
  const card3 = data.cards.find(c => c.id === '03');
  const card4 = data.cards.find(c => c.id === '04');

  return (
    <section className="page-section bg-white" id="section6">
      {/* Tabs */}
      <div className="section-tabs-container">
        <a href="#section1" className="tab-btn red" style={{ textDecoration: 'none', textAlign: 'center' }}>
          HOME
        </a>
        <button className="tab-btn red" onClick={() => onOpenGift('Sản xuất vật chất')}>
          GIFT
        </button>
        <button className="tab-btn outline" onClick={() => onOpenGame('Sản xuất vật chất')}>
          GAME
        </button>
      </div>

      {/* Heading */}
      <h2 className="section-title">
        SẢN XUẤT <span className="highlight">{data.titleHighlight}</span>
      </h2>

      {/* Grid Layout conforming to the screenshot:
          - Column 1: Card 01 (top) and Card 03 (bottom)
          - Column 2: Card 02 (spanning full)
          - Column 3: Card 04 (spanning full)
      */}
      <div className="s6-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
        {/* Column 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {card1 && (
            <div className="s6-card">
              <span className="s6-card-num">{card1.id}</span>
              <h3 className="s6-card-title">{card1.title}</h3>
              <p className="s6-card-desc">{card1.desc}</p>
            </div>
          )}
          {card3 && (
            <div className="s6-card">
              <span className="s6-card-num">{card3.id}</span>
              <h3 className="s6-card-title">{card3.title}</h3>
              <p className="s6-card-desc">{card3.desc}</p>
            </div>
          )}
        </div>

        {/* Column 2 */}
        <div>
          {card2 && (
            <div className="s6-card" style={{ height: '100%', justifyContent: 'flex-start' }}>
              <span className="s6-card-num">{card2.id}</span>
              <h3 className="s6-card-title">{card2.title}</h3>
              <p className="s6-card-desc">{card2.desc}</p>
            </div>
          )}
        </div>

        {/* Column 3 */}
        <div>
          {card4 && (
            <div className="s6-card" style={{ height: '100%', justifyContent: 'flex-start' }}>
              <span className="s6-card-num">{card4.id}</span>
              <h3 className="s6-card-title">{card4.title}</h3>
              <p className="s6-card-desc">{card4.desc}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
