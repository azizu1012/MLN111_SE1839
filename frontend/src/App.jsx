import React, { useEffect, useState } from 'react';
import HeroSection from './components/HeroSection';
import DefinitionBar from './components/DefinitionBar';
import LearningView from './components/LearningView';
import GamePage from './components/GamePage';
import Footer from './components/Footer';
import GiftModal from './components/GiftModal';
import AIChatbot from './components/AIChatbot';

export default function App() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('home');
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [gameContext, setGameContext] = useState('Ôn tập học thuyết hình thái kinh tế - xã hội');
  const [activeGiftSection, setActiveGiftSection] = useState(null);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => {
        if (!res.ok) throw new Error('Không thể kết nối tới server API.');
        return res.json();
      })
      .then((resJson) => {
        if (resJson.success) {
          setContent(resJson.data);
          const firstSection = resJson.data.learningSections?.[0]?.id;
          if (firstSection) setActiveSectionId(firstSection);
        } else {
          setError(resJson.message || 'Lỗi xử lý dữ liệu từ backend.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Không kết nối được tới server backend. Hãy đảm bảo server Node.js đang chạy trên cổng 5000!');
        setLoading(false);
      });
  }, []);

  const learningSections = content?.learningSections || [];
  const firstSectionId = learningSections[0]?.id;

  const scrollToTop = () => {
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  const showHome = () => {
    setActiveView('home');
    scrollToTop();
  };

  const showLearning = (sectionId = activeSectionId || firstSectionId) => {
    if (sectionId) setActiveSectionId(sectionId);
    setActiveView('learn');
    scrollToTop();
  };

  const showGame = (sectionName = 'Ôn tập học thuyết hình thái kinh tế - xã hội') => {
    setGameContext(sectionName);
    setActiveView('game');
    scrollToTop();
  };

  const openGift = (sectionName) => setActiveGiftSection(sectionName);
  const closeGift = () => setActiveGiftSection(null);

  if (loading) {
    return (
      <div className="app-loading">
        <div>★</div>
        <h2>ĐANG TẢI GIÁO TRÌNH HỌC TẬP...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-error">
        <h2>Gặp lỗi kết nối hệ thống</h2>
        <p>{error}</p>
        <button type="button" className="tab-btn red" onClick={() => window.location.reload()}>
          Tải lại trang
        </button>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <header className="main-header">
        <button type="button" className="header-logo-container header-logo-button" onClick={showHome}>
          <span className="logo-badge">MÁC - LÊNIN</span>
          <span className="header-title-text">HÌNH THÁI KINH TẾ - XÃ HỘI</span>
        </button>
        <nav aria-label="Điều hướng chính">
          <ul className="header-nav">
            <li>
              <button type="button" className={`nav-link ${activeView === 'home' ? 'active' : ''}`} onClick={showHome}>
                Tổng quan
              </button>
            </li>
            {learningSections.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  className={`nav-link ${activeView === 'learn' && activeSectionId === section.id ? 'active' : ''}`}
                  onClick={() => showLearning(section.id)}
                >
                  {section.menuTitle || section.title}
                </button>
              </li>
            ))}
            <li>
              <button type="button" className={`nav-link nav-link-game ${activeView === 'game' ? 'active' : ''}`} onClick={() => showGame()}>
                Game
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {activeView === 'home' && (
        <>
          <HeroSection
            data={content.hero}
            onStartLearning={() => showLearning(firstSectionId)}
            onOpenGame={showGame}
          />
          <DefinitionBar data={content.definitionBar} />
          <section className="home-index-section">
            <div className="home-index-heading">
              <span className="learning-eyebrow">LỘ TRÌNH HỌC</span>
              <h2>Chia nhỏ nội dung thành các mục như một chuyên trang học tập</h2>
              <p>
                Mỗi mục dưới đây được tóm tắt từ phần học thuyết hình thái kinh tế - xã hội trong giáo trình chính, giúp bạn học theo từng lát cắt thay vì đọc một khối văn bản dài.
              </p>
            </div>
            <div className="home-index-grid">
              {learningSections.map((section, index) => (
                <button type="button" className="home-index-card" key={section.id} onClick={() => showLearning(section.id)}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{section.title}</strong>
                  <small>{section.lead}</small>
                </button>
              ))}
            </div>
          </section>
          <Footer data={content.footer} />
        </>
      )}

      {activeView === 'learn' && (
        <>
          <LearningView
            sections={learningSections}
            activeSectionId={activeSectionId}
            onSelectSection={showLearning}
            onOpenGame={showGame}
            onOpenGift={openGift}
          />
          <Footer data={content.footer} />
        </>
      )}

      {activeView === 'game' && (
        <GamePage
          sectionName={gameContext}
          onBack={() => showLearning(activeSectionId || firstSectionId)}
          onOpenGift={openGift}
        />
      )}

      {activeGiftSection && (
        <GiftModal
          sectionName={activeGiftSection}
          onClose={closeGift}
        />
      )}

      <AIChatbot />
    </div>
  );
}
