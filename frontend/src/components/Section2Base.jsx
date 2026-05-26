import React from 'react';

export default function Section2Base({ data, onOpenGame, onOpenGift }) {
  if (!data) return null;

  return (
    <section className="page-section bg-white" id="section2">
      {/* Navigation Tabs for this section */}
      <div className="section-tabs-container">
        <a href="#section1" className="tab-btn red" style={{ textDecoration: 'none', textAlign: 'center' }}>
          HOME
        </a>
        <button className="tab-btn red" onClick={() => onOpenGift('Sự sản xuất xã hội')}>
          GIFT
        </button>
        <button className="tab-btn outline" onClick={() => onOpenGame('Sự sản xuất xã hội')}>
          GAME
        </button>
      </div>

      {/* Main Title */}
      <h2 className="section-title">
        SẢN XUẤT VẬT CHẤT LÀ CƠ SỞ <span className="highlight">{data.titleHighlight}</span> SỰ TỒN TẠI VÀ PHÁT TRIỂN XÃ HỘI
      </h2>

      {/* Cards Grid */}
      <div className="s2-grid">
        {data.cards.map((card) => (
          <div className="s2-card" key={card.id}>
            <span className="s2-card-num">{card.id}</span>
            <h3 className="s2-card-title">{card.title}</h3>
            <p className="s2-card-desc">{card.description}</p>
          </div>
        ))}

        {/* Featured Red Card with Star */}
        <div className="s2-card featured-red">
          <div className="s2-star-icon">{data.featuredCard.star}</div>
          <h3 className="s2-featured-title">{data.featuredCard.title}</h3>
          <p className="s2-featured-desc">{data.featuredCard.description}</p>
        </div>
      </div>
    </section>
  );
}
