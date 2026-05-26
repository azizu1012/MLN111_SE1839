import React from 'react';

export default function Section3WhatIs({ data, onOpenGame, onOpenGift }) {
  if (!data) return null;

  return (
    <section className="page-section bg-cream" id="section3">
      {/* Tabs */}
      <div className="section-tabs-container">
        <a href="#section1" className="tab-btn red" style={{ textDecoration: 'none', textAlign: 'center' }}>
          HOME
        </a>
        <button className="tab-btn red" onClick={() => onOpenGift('Khái niệm Sản xuất')}>
          GIFT
        </button>
        <button className="tab-btn outline" onClick={() => onOpenGame('Khái niệm Sản xuất')}>
          GAME
        </button>
      </div>

      {/* Heading */}
      <h2 className="section-title">
        SẢN XUẤT <span className="highlight">{data.titleHighlight}</span>
      </h2>

      {/* Two columns */}
      <div className="s3-container">
        {data.cards.map((card, idx) => (
          <div className="s3-card" key={idx}>
            <div>
              <h3 className="s3-card-type">{card.type}</h3>
              <p className="s3-card-content">{card.content}</p>
            </div>
            {card.author && (
              <span className="s3-card-author">
                - {card.author}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
