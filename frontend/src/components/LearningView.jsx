import React from 'react';

export default function LearningView({ sections, activeSectionId, onSelectSection, onOpenGame, onOpenGift }) {
  if (!sections || sections.length === 0) return null;

  const activeIndex = Math.max(0, sections.findIndex((section) => section.id === activeSectionId));
  const activeSection = sections[activeIndex] || sections[0];
  const previousSection = sections[activeIndex - 1];
  const nextSection = sections[activeIndex + 1];

  return (
    <main className="learning-shell">
      <aside className="learning-rail" aria-label="Danh mục bài học">
        <span className="learning-rail-label">MỤC HỌC</span>
        {sections.map((section, index) => (
          <button
            key={section.id}
            type="button"
            className={`learning-rail-item ${section.id === activeSection.id ? 'active' : ''}`}
            onClick={() => onSelectSection(section.id)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {section.menuTitle || section.title}
          </button>
        ))}
      </aside>

      <article className="learning-panel">
        <div className="learning-panel-header">
          <div>
            <span className="learning-eyebrow">{activeSection.eyebrow}</span>
            <h1>{activeSection.title}</h1>
          </div>
          <span className="source-pill">Giáo trình chuẩn</span>
        </div>

        <p className="learning-lead">{activeSection.lead}</p>

        {activeSection.sourceNote && (
          <div className="source-note">
            {activeSection.sourceNote}
          </div>
        )}

        {activeSection.highlights && (
          <div className="learning-highlight-grid">
            {activeSection.highlights.map((item) => (
              <div className="learning-highlight-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        )}

        {activeSection.blocks && (
          <div className="learning-block-grid">
            {activeSection.blocks.map((block) => (
              <section className="learning-block" key={block.title}>
                <h3>{block.title}</h3>
                <p>{block.body}</p>
                {block.points && (
                  <ul>
                    {block.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        )}

        {activeSection.conceptMap && (
          <div className="concept-map-panel">
            <h3>Sơ đồ khái niệm</h3>
            <div className="concept-map-grid">
              {activeSection.conceptMap.map((concept) => (
                <div className="concept-chip" key={concept.term}>
                  <strong>{concept.term}</strong>
                  <span>{concept.definition}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection.takeaway && (
          <div className="learning-takeaway">
            <span>Kết luận cần nhớ</span>
            <p>{activeSection.takeaway}</p>
          </div>
        )}

        <div className="learning-actions">
          <button
            type="button"
            className="tab-btn outline"
            onClick={() => previousSection && onSelectSection(previousSection.id)}
            disabled={!previousSection}
          >
            ← Mục trước
          </button>
          <button
            type="button"
            className="tab-btn red"
            onClick={() => onOpenGame(activeSection.title)}
          >
            Ôn tập bằng Game
          </button>
          <button
            type="button"
            className="tab-btn outline"
            onClick={() => onOpenGift(activeSection.title)}
          >
            Gift
          </button>
          <button
            type="button"
            className="tab-btn outline"
            onClick={() => nextSection && onSelectSection(nextSection.id)}
            disabled={!nextSection}
          >
            Mục sau →
          </button>
        </div>
      </article>
    </main>
  );
}
