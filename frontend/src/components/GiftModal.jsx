import React, { useState, useEffect, useRef } from 'react';

export default function GiftModal({ sectionName, onClose }) {
  const [quizScore, setQuizScore] = useState(null);
  const [cubeState, setCubeState] = useState('initial'); // 'initial', 'exploding', 'exploded'
  const [collageVisible, setCollageVisible] = useState(false);
  
  const shockwaveRef = useRef(null);

  useEffect(() => {
    const score = localStorage.getItem('philosophy_quiz_score');
    if (score !== null) {
      setQuizScore(parseInt(score, 10));
    }
  }, []);

  const isEligible = quizScore !== null && quizScore >= 80;

  const triggerCubeExplosion = () => {
    // 1. Play shockwave
    if (shockwaveRef.current) {
      if (!document.getElementById('shockwaveReactStyle')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = "shockwaveReactStyle";
        styleSheet.innerText = `@keyframes shockwaveExpand {
          0% { width: 0px; height: 0px; opacity: 1; }
          100% { width: 1200px; height: 1200px; opacity: 0; }
        }`;
        document.head.appendChild(styleSheet);
      }
      
      shockwaveRef.current.style.animation = 'none';
      void shockwaveRef.current.offsetWidth; // trigger reflow
      shockwaveRef.current.style.animation = 'shockwaveExpand 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards';
    }

    // 2. Animate Cube exploded state
    setCubeState('exploding');

    // 3. Morph modal content
    setTimeout(() => {
      setCubeState('exploded');
      setCollageVisible(true);
    }, 550);
  };

  const handleCollapse = () => {
    setCollageVisible(false);
    setTimeout(() => {
      setCubeState('exploding');
      setTimeout(() => {
        setCubeState('initial');
      }, 50);
    }, 350);
  };

  const getItemStyle = (index, baseStyles = {}, baseTransform = '') => {
    const totalItems = 15;
    const originalTransform = baseTransform || 'none';
    const transformWithScale = collageVisible 
      ? originalTransform 
      : `${originalTransform === 'none' ? '' : originalTransform} scale(0.6)`;
      
    return {
      ...baseStyles,
      position: 'absolute',
      transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.15)',
      transitionDelay: collageVisible 
        ? `${index * 30}ms` 
        : `${(totalItems - 1 - index) * 15}ms`,
      opacity: collageVisible ? 1 : 0,
      transform: transformWithScale
    };
  };

  // Determine modal sizing dynamically based on state
  const isCollageVisible = isEligible && collageVisible;
  const modalStyle = {
    transition: 'all 0.5s cubic-bezier(0.25, 1, 0.25, 1)',
    maxWidth: isCollageVisible ? '1000px' : '600px',
    backgroundColor: isCollageVisible ? '#E5E2D9' : 'var(--bg-cream)',
    padding: isCollageVisible ? '25px' : '40px',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>

        {/* Modal headers - hidden when collage is revealed */}
        {!isCollageVisible && (
          <>
            <h2 className="modal-title" id="giftModalTitle">
              PHẦN THƯỞNG HỌC TẬP: <span className="red">GIFT</span>
            </h2>
            <p id="giftModalSub" style={{ fontSize: '0.9rem', color: '#666666', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '10px' }}>
              Yêu cầu từ phần: <strong>{sectionName}</strong>
            </p>
          </>
        )}

        {/* LOCKED STATE */}
        {!isEligible && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>🎁</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--primary-red)', letterSpacing: '-0.5px' }}>
              QUÀ TẶNG HỌC THUẬT ĐANG KHÓA
            </h3>
            <p style={{ textAlign: 'left' }}>
              Hệ thống quà tặng là một tài liệu tổng hợp **Sơ đồ tư duy dạng Mindmap độc quyền** giúp bạn dễ dàng ôn tập kỳ thi Triết học Mác-Lênin.
            </p>
            <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '15px', textAlign: 'left' }}>
              <strong>Cách mở khóa:</strong>
              <ol style={{ paddingLeft: '20px', marginTop: '5px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <li>Quay lại menu chính của trang học tập.</li>
                <li>Bấm vào mục <strong>GAME</strong> trên thanh menu.</li>
                <li>Hoàn thành bài trắc nghiệm và đạt tối thiểu <strong>80 điểm</strong>.</li>
                <li>Quay lại đây để mở khóa quà tặng học tập.</li>
              </ol>
            </div>
            {quizScore !== null && (
              <p style={{ color: 'var(--primary-red)', fontWeight: 'bold' }}>
                Điểm số hiện tại của bạn: {quizScore}/100. Hãy thi lại ở mục GAME trên menu!
              </p>
            )}
            <button className="tab-btn outline" onClick={onClose} style={{ alignSelf: 'center', marginTop: '10px' }}>
              ĐỒNG Ý
            </button>
          </div>
        )}

        {/* UNLOCKED STATE */}
        {isEligible && (
          <>
            {/* STEP 1: 3D ISOMETRIC CUBE */}
            <div 
              style={{ 
                display: cubeState === 'exploded' ? 'none' : 'flex', 
                flexDirection: 'column', 
                gap: '15px', 
                textAlign: 'center', 
                justifyContent: 'center', 
                alignItems: 'center',
                transition: 'opacity 0.4s ease',
                opacity: cubeState === 'exploding' ? 0 : 1
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--primary-red)', letterSpacing: '-0.8px', marginBottom: '5px' }}>
                BẠN ĐÃ MỞ KHÓA THÀNH CÔNG!
              </h3>
              <p style={{ fontSize: '0.9rem', maxWidth: '500px', marginBottom: '5px' }}>
                Một khối cấu trúc tri thức mới đã được liên kết. Hãy nhấp chuột trực tiếp vào khối hộp 3D dưới đây để khám phá kết cấu chi tiết:
              </p>
              
              {/* 3D Cube Clickable Wrapper */}
              <div className="gift-cube-wrapper" onClick={triggerCubeExplosion}>
                <div className="cube-shockwave" ref={shockwaveRef}></div>
                <div className={`gift-cube ${cubeState === 'exploding' || cubeState === 'exploded' ? 'exploded' : ''}`}>
                  <div className="cube-face top"></div>
                  <div className="cube-face left"></div>
                  <div className="cube-face right">
                    <div className="cube-text-container">
                      <span className="cube-text">khám phá kết cấu</span>
                    </div>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#888888', fontStyle: 'italic' }}>
                *Nhấp chuột vào khối hộp để kích hoạt hiệu ứng tỏa*
              </p>
            </div>

            {/* STEP 2: STUNNING COLLEGE MINDMAP (Image 3) */}
            <div 
              className={`collage-canvas ${collageVisible ? 'visible' : ''}`}
              style={{ 
                display: cubeState === 'initial' ? 'none' : 'block', 
                width: '1000px', 
                height: '560px', 
                cursor: 'zoom-out',
                opacity: collageVisible ? 1 : 0,
                transform: collageVisible ? 'scale(1)' : 'scale(0.9)',
                transition: 'all 0.5s cubic-bezier(0.25, 1, 0.25, 1)'
              }}
              onClick={handleCollapse}
            >
              {/* Collapse Hint */}
              <div style={{ position: 'absolute', top: '15px', left: '20px', zIndex: 10, fontSize: '0.8rem', color: '#666666', fontFamily: 'sans-serif', fontStyle: 'italic', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '5px 12px', border: '1px solid #ccc', borderRadius: '4px', boxShadow: '1px 1px 3px rgba(0,0,0,0.1)', pointerEvents: 'none' }}>
                🔄 Nhấp chuột vào sơ đồ để thu gọn
              </div>

              {/* Slanted Background overlay triangles in the top-right (Image 3) */}
              <div style={{ position: 'absolute', top: 0, right: 0, width: '320px', height: '180px', backgroundColor: 'var(--primary-red)', clipPath: 'polygon(100% 0, 30% 0, 100% 100%)', opacity: 0.85, zIndex: 1 }}></div>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '440px', height: '240px', backgroundColor: '#D2CFB9', clipPath: 'polygon(100% 0, 15% 0, 100% 100%)', zIndex: 0 }}></div>

              {/* Grid Lines Background */}
              <div className="collage-bg-line" style={{ width: '100%', height: '1px', left: 0, top: '80px' }}></div>
              <div className="collage-bg-line" style={{ width: '100%', height: '1px', left: 0, top: '180px' }}></div>
              <div className="collage-bg-line" style={{ width: '100%', height: '1px', left: 0, top: '290px' }}></div>
              <div className="collage-bg-line" style={{ width: '100%', height: '1px', left: 0, top: '410px' }}></div>
              <div className="collage-bg-line" style={{ width: '1px', height: '100%', left: '160px', top: 0 }}></div>
              <div className="collage-bg-line" style={{ width: '1px', height: '100%', left: '350px', top: 0 }}></div>
              <div className="collage-bg-line" style={{ width: '1px', height: '100%', left: '600px', top: 0 }}></div>
              <div className="collage-bg-line" style={{ width: '1px', height: '100%', left: '780px', top: 0 }}></div>
              
              {/* Diagonal guide lines crossing the collage (Image 3) */}
              <div className="collage-bg-line red-accent" style={{ width: '120%', height: '3px', left: '-10%', top: '260px', transform: 'rotate(-10deg)' }}></div>
              <div className="collage-bg-line red-accent" style={{ width: '120%', height: '1px', left: '-10%', top: '266px', transform: 'rotate(-10deg)' }}></div>
              <div className="collage-bg-line" style={{ width: '120%', height: '1px', left: '-10%', top: '200px', transform: 'rotate(-10deg)' }}></div>
              <div className="collage-bg-line" style={{ width: '120%', height: '1px', left: '-10%', top: '380px', transform: 'rotate(-10deg)' }}></div>
              
              {/* Fist Graphic Element (Left) (Image 3) */}
              <div className="collage-item collage-fist-container" style={getItemStyle(0, { left: '-10px', bottom: '0px', width: '230px', height: '350px' })}>
                <svg viewBox="0 0 200 300" style={{ width: '100%', height: '100%' }}>
                  <path d="M 0 300 
                           L 35 190 
                           C 30 180, 25 165, 30 145 
                           C 33 130, 45 110, 60 112 
                           C 75 114, 80 125, 80 135 
                           C 80 120, 95 105, 110 108 
                           C 125 110, 130 125, 130 135 
                           C 130 120, 145 108, 160 112 
                           C 175 115, 180 130, 180 145 
                           C 180 135, 192 135, 198 148 
                           C 202 158, 195 185, 180 205 
                           L 145 300 Z" 
                        fill="#000000" />
                  <path d="M 12 250 L 160 215" stroke="#FFFFFF" strokeWidth="3" />
                  <path d="M 33 190 C 45 195, 65 198, 75 185 C 85 170, 75 150, 60 152" fill="#000000" stroke="#FFFFFF" strokeWidth="2" />
                </svg>
              </div>

              {/* Red Slanted Tag */}
              <div className="collage-tag" style={getItemStyle(1, { left: '15px', bottom: '85px' }, 'rotate(-10deg)')}>khám phá kết cấu</div>

              {/* Title Block */}
              <div className="collage-item collage-title-block" style={getItemStyle(2, { left: '180px', top: '60px' })}>
                <span className="collage-badge" style={{ backgroundColor: '#9E1B1B', padding: '4px 10px', fontSize: '0.75rem' }}>CHƯƠNG 3</span>
                <h3 className="collage-title-text" style={{ fontSize: '1.4rem', fontWeight: 900, lineHeight: 1.1, marginTop: '5px', color: '#000', borderBottom: 'none' }}>HỌC THUYẾT<br />HÌNH THÁI KINH<br />TẾ - XÃ HỘI<br />MÁC - LÊNIN</h3>
                <div style={{ width: '100px', height: '4px', backgroundColor: 'var(--primary-red)', marginTop: '8px' }}></div>
              </div>

              {/* Floating Letters (Staggered climbing diagonal spelling M A C L e n i N) */}
              {/* M: Giant red letter with no box */}
              <div className="collage-item" style={getItemStyle(3, { left: '180px', top: '290px', fontFamily: 'var(--font-heading)', fontSize: '5.5rem', fontWeight: 900, color: 'var(--primary-red)', lineHeight: 1.0, zIndex: 5 }, 'rotate(-15deg)')}>M</div>
              {/* A */}
              <div className="collage-item collage-letter-box black" style={getItemStyle(4, { left: '260px', top: '205px', width: '55px', height: '65px', borderRadius: 0 }, 'rotate(-10deg) skewX(-10deg)')}>A</div>
              {/* C */}
              <div className="collage-item collage-letter-box red" style={getItemStyle(5, { left: '350px', top: '180px', width: '55px', height: '65px', borderRadius: 0 }, 'rotate(8deg)')}>C</div>
              {/* L */}
              <div className="collage-item collage-letter-box black" style={getItemStyle(6, { left: '425px', top: '140px', width: '55px', height: '65px', borderRadius: 0 }, 'rotate(-12deg)')}>L</div>
              {/* e */}
              <div className="collage-item collage-letter-box red" style={getItemStyle(7, { left: '495px', top: '175px', width: '55px', height: '65px', borderRadius: 0, fontSize: '1.5rem', textTransform: 'lowercase' }, 'rotate(10deg)')}>e</div>
              {/* n */}
              <div className="collage-item collage-letter-box red" style={getItemStyle(8, { left: '560px', top: '160px', width: '55px', height: '65px', borderRadius: 0, fontSize: '1.5rem', textTransform: 'lowercase' }, 'rotate(-8deg)')}>n</div>
              {/* i */}
              <div className="collage-item collage-letter-box black" style={getItemStyle(9, { left: '590px', top: '215px', width: '45px', height: '55px', borderRadius: 0, fontSize: '1.5rem', textTransform: 'lowercase' }, 'rotate(5deg)')}>i</div>
              {/* N (on top of the red 3D pillar) */}
              <div className="collage-item collage-letter-box black" style={getItemStyle(10, { left: '560px', top: '75px', width: '55px', height: '65px', borderRadius: 0, zIndex: 6 }, 'rotate(-5deg)')}>N</div>

              {/* CSS 3D Red Pillar behind N and i */}
              <div className="collage-item" style={getItemStyle(11, { left: '570px', top: '130px', width: '120px', height: '320px', transformStyle: 'preserve-3d', perspective: '1000px', zIndex: 2 })}>
                {/* Front-left face */}
                <div style={{ position: 'absolute', left: 0, top: '40px', width: '60px', height: '260px', backgroundColor: '#9E1B1B', transform: 'skewY(30deg)', borderLeft: '1px solid rgba(0,0,0,0.2)' }}></div>
                {/* Front-right face */}
                <div style={{ position: 'absolute', left: '60px', top: '40px', width: '60px', height: '260px', backgroundColor: '#D63031', transform: 'skewY(-30deg)', borderRight: '1px solid rgba(0,0,0,0.2)' }}></div>
                {/* Top face */}
                <div style={{ position: 'absolute', left: 0, top: '10px', width: '120px', height: '60px', backgroundColor: '#B23A3A', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
              </div>


              {/* Top center paper block explaining formation */}
              <div className="collage-item collage-paper-box" style={getItemStyle(12, { left: '320px', top: '30px', width: '220px', borderLeft: '5px solid var(--primary-black)' }, 'rotate(-1deg)')}>
                Phạm trù trung tâm của chủ nghĩa duy vật lịch sử, do C. Mác sáng lập và được V. I. Lênin phát triển – lý giải xã hội như một chỉnh thể vận động theo các quy luật khách quan.
              </div>

              {/* PH. ĂNGGHEN ribbon */}
              <div className="collage-item collage-ribbon" style={getItemStyle(13, { left: '740px', top: '80px', backgroundColor: '#000', color: '#fff', boxShadow: '4px 4px 0px var(--primary-red)' }, 'rotate(-8deg)')}>
                PH. ĂNGGHEN
              </div>

              {/* Right Red Box */}
              <div className="collage-item collage-red-box" style={getItemStyle(14, { left: '680px', top: '220px', width: '260px', boxShadow: '6px 6px 0px var(--primary-black)' }, 'rotate(-6deg)')}>
                SẢN XUẤT VẬT CHẤT LÀ CƠ SỞ CỦA SỰ TỒN TẠI VÀ PHÁT TRIỂN XÃ HỘI.
                <br />
                <span style={{ backgroundColor: '#000', color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: '900', fontSize: '1.05rem', padding: '4px 15px', display: 'inline-block', marginTop: '10px', letterSpacing: '1px', transform: 'rotate(6deg)' }}>1990</span>
              </div>

              {/* Bottom center left quote (Black text, slanted) */}
              <div className="collage-item" style={getItemStyle(15, { left: '260px', top: '380px', width: '220px', fontSize: '0.8rem', fontWeight: 900, fontStyle: 'italic', lineHeight: 1.3, color: '#000', borderBottom: '2px solid #000', paddingBottom: '5px' }, 'rotate(-10deg)')}>
                Để tồn tại và phát triển, con người phải tiến hành sản xuất.
              </div>

              {/* Bottom center right quote (Red text, slanted) */}
              <div className="collage-item" style={getItemStyle(16, { left: '450px', top: '430px', width: '240px', fontSize: '0.88rem', fontWeight: 900, fontStyle: 'italic', lineHeight: 1.3, color: 'var(--primary-red)', borderBottom: '2px solid var(--primary-red)', paddingBottom: '5px' }, 'rotate(-8deg)')}>
                Đó là hoạt động đặc trưng riêng có của con người và xã hội loài người.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
