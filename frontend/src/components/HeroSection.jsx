import React from 'react';

export default function HeroSection({ data, onStartLearning, onOpenGame }) {
  if (!data) return null;

  return (
    <section className="page-section bg-white" id="section1" style={{ minHeight: '85vh', overflow: 'hidden' }}>
      <div className="hero-star-watermark">★</div>

      <div className="hero-container">
        <div className="hero-left">
          <div className="hero-logo-tag">
            <span className="logo-badge" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
              {data.subTitle}
            </span>
          </div>

          <h1 className="hero-title" style={{ marginTop: '10px' }}>
            {data.titleLine1} <br />
            <span className="red-text">{data.titleLine2}</span> <br />
            {data.titleLine3}
          </h1>

          <p className="hero-description" style={{ fontSize: '1.05rem', margin: '15px 0 25px 0' }}>
            {data.description}
          </p>

          <div className="hero-buttons">
            <button type="button" className="tab-btn red" onClick={onStartLearning}>
              Bắt đầu học →
            </button>
            <button type="button" className="tab-btn outline" onClick={() => onOpenGame('Ôn tập tổng quan học thuyết')}>
              Game
            </button>
          </div>
        </div>

        <div className="hero-right" style={{ zIndex: 3 }}>
          <div className="hero-right-card">
            <h3 className="quote-title">{data.quoteTitle}</h3>
            <p className="quote-content">"{data.quoteContent}"</p>
            <button type="button" className="quote-action quote-action-button" onClick={onStartLearning}>
              {data.quoteAction}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
