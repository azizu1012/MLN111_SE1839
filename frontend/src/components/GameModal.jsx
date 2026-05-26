import React, { useState, useEffect } from 'react';

export default function GameModal({ sectionName, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/game/questions')
      .then((res) => {
        if (!res.ok) throw new Error('Không thể lấy câu hỏi từ server.');
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setQuestions(data.questions);
        } else {
          setError(data.message || 'Lỗi tải dữ liệu.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Không thể kết nối đến server backend.');
        setLoading(false);
      });
  }, []);

  const handleSelectOption = (qId, option) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) {
        correctCount++;
      }
    });
    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setScore(calculatedScore);
    
    // Save score to local storage for Gift section to read
    localStorage.setItem('philosophy_quiz_score', calculatedScore);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <h2 className="modal-title">
          HỌC TẬP TƯƠNG TÁC: <span className="red">GAME</span>
        </h2>
        
        <p style={{ fontSize: '0.9rem', color: '#666666', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
          Đang ôn tập phần: <strong>{sectionName}</strong>
        </p>

        {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải bộ câu hỏi trắc nghiệm học thuật...</div>}
        
        {error && (
          <div style={{ color: 'var(--primary-red)', padding: '10px', border: '1px solid var(--primary-red)', backgroundColor: '#fff5f5' }}>
            {error}
          </div>
        )}

        {!loading && !error && score === null && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {questions.map((q, idx) => (
              <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--primary-black)' }}>
                  Câu {idx + 1}: {q.question}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {q.options.map((opt) => {
                    const isSelected = answers[q.id] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelectOption(q.id, opt)}
                        style={{
                          textAlign: 'left',
                          padding: '12px 15px',
                          border: isSelected ? '2px solid var(--primary-red)' : '1px solid #ccc',
                          backgroundColor: isSelected ? '#fff5f5' : 'white',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          borderRadius: '0px'
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            
            <button 
              className="tab-btn red" 
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < questions.length}
              style={{ 
                marginTop: '10px', 
                alignSelf: 'center',
                opacity: Object.keys(answers).length < questions.length ? 0.6 : 1,
                cursor: Object.keys(answers).length < questions.length ? 'not-allowed' : 'pointer'
              }}
            >
              NỘP BÀI & XEM ĐIỂM
            </button>
          </div>
        )}

        {score !== null && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px 0' }}>
            <div style={{ fontSize: '4rem', color: 'var(--primary-red)', fontFamily: 'var(--font-heading)', fontWeight: '900' }}>
              {score} / 100
            </div>
            
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>
              {score >= 80 ? '🎉 Xuất sắc! Bạn đã thông hiểu bài học!' : '📚 Hãy cố gắng ôn tập kỹ hơn nhé!'}
            </h3>
            
            <p>
              {score >= 80 
                ? 'Hãy nhấp vào tab "GIFT" tại bất kỳ phần nào trên trang chủ để nhận quà tặng Sơ đồ tư duy học tập!'
                : 'Bạn cần đạt từ 80 điểm trở lên để mở khóa quà tặng học tập.'}
            </p>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '10px' }}>
              <button className="tab-btn outline" onClick={() => { setScore(null); setAnswers({}); }}>
                LÀM LẠI
              </button>
              <button className="tab-btn red" onClick={onClose}>
                ĐÓNG
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
