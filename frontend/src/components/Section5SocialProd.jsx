import React from 'react';

export default function Section5SocialProd({ data, onOpenGame, onOpenGift }) {
  if (!data) return null;

  return (
    <section className="page-section bg-cream" id="section5">
      {/* Tabs */}
      <div className="section-tabs-container">
        <a href="#section1" className="tab-btn red" style={{ textDecoration: 'none', textAlign: 'center' }}>
          HOME
        </a>
        <button className="tab-btn red" onClick={() => onOpenGift('Sự sản xuất xã hội sâu')}>
          GIFT
        </button>
        <button className="tab-btn outline" onClick={() => onOpenGame('Sự sản xuất xã hội sâu')}>
          GAME
        </button>
      </div>

      {/* Heading */}
      <h2 className="section-title">
        SỰ SẢN XUẤT <span className="highlight">{data.titleHighlight}</span>
      </h2>

      {/* Columns Grid */}
      <div className="s5-grid">
        {data.columns.map((col, idx) => (
          <div className="s5-col" key={idx}>
            <h3 className="s5-col-title">{col.title}</h3>
            <p className="s5-col-desc">{col.desc}</p>
          </div>
        ))}
      </div>

      {/* Callout Box */}
      <div className="s5-callout">
        <p className="s5-callout-quote">"{data.callout.quote}"</p>
        <span className="s5-callout-author">{data.callout.author}</span>
      </div>
    </section>
  );
}
