import React from 'react';

export default function Section4Timeline({ data, onOpenGame, onOpenGift }) {
  if (!data) return null;

  return (
    <section className="page-section bg-white" id="section4">
      {/* Tabs */}
      <div className="section-tabs-container" style={{ marginBottom: '30px' }}>
        <a href="#section1" className="tab-btn red" style={{ textDecoration: 'none', textAlign: 'center' }}>
          HOME
        </a>
        <button className="tab-btn red" onClick={() => onOpenGift('Tiến trình lịch sử')}>
          GIFT
        </button>
        <button className="tab-btn outline" onClick={() => onOpenGame('Tiến trình lịch sử')}>
          GAME
        </button>
      </div>

      {/* Heading */}
      <h2 className="section-title">
        TIẾN TRÌNH <span className="highlight">{data.titleHighlight}</span>
      </h2>

      {/* Description */}
      <p className="s4-desc">{data.description}</p>

      {/* Timeline Graphic */}
      <div className="timeline-wrapper">
        <div className="timeline-line"></div>
        <div className="timeline-nodes">
          {data.timeline.map((node) => (
            <div className="timeline-node" key={node.step}>
              <div className="timeline-circle">{node.step}</div>
              <h4 className="timeline-title">{node.title}</h4>
              <p className="timeline-desc">{node.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
