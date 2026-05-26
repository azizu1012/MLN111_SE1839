import React, { useEffect, useState } from 'react';

export default function GamePage({ sectionName, onBack, onOpenGift }) {
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
    const correctCount = questions.reduce((total, question) => (
      answers[question.id] === question.answer ? total + 1 : total
    ), 0);
    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setScore(calculatedScore);
    localStorage.setItem('philosophy_quiz_score', calculatedScore);
  };

  const handleRetry = () => {
    setScore(null);
    setAnswers({});
  };

  const isComplete = questions.length > 0 && Object.keys(answers).length === questions.length;

  return (
    <main className="game-page-shell">
      <section className="game-page-hero">
        <div>
          <span className="learning-eyebrow">TRẮC NGHIỆM TƯƠNG TÁC</span>
          <h1>GAME ÔN TẬP</h1>
          <p>
            Bộ câu hỏi bám sát học thuyết hình thái kinh tế - xã hội, giúp kiểm tra nhanh các khái niệm, quy luật và giá trị phương pháp luận trọng tâm.
          </p>
        </div>
        <div className="game-context-card">
          <span>Đang ôn tập</span>
          <strong>{sectionName}</strong>
        </div>
      </section>

      <section className="game-page-card">
        {loading && <div className="game-state-message">Đang tải bộ câu hỏi...</div>}

        {error && (
          <div className="game-error-message">
            {error}
          </div>
        )}

        {!loading && !error && score === null && (
          <div className="quiz-stack">
            {questions.map((question, index) => (
              <div className="quiz-question-card" key={question.id}>
                <div className="quiz-question-title">
                  <span>Câu {index + 1}</span>
                  <h3>{question.question}</h3>
                </div>
                <div className="quiz-options">
                  {question.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`quiz-option ${answers[question.id] === option ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(question.id, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="game-page-actions">
              <button type="button" className="tab-btn outline" onClick={onBack}>
                Quay lại bài học
              </button>
              <button
                type="button"
                className="tab-btn red"
                onClick={handleSubmit}
                disabled={!isComplete}
              >
                Nộp bài & xem điểm
              </button>
            </div>
          </div>
        )}

        {score !== null && (
          <div className="quiz-result-panel">
            <div className="quiz-score-ring">
              <strong>{score}</strong>
              <span>/100</span>
            </div>
            <h2>{score >= 80 ? 'Bạn đã nắm chắc nội dung trọng tâm' : 'Bạn cần ôn lại các mục trọng tâm'}</h2>
            <p>
              {score >= 80
                ? 'Điểm số đã đủ điều kiện mở khóa phần Gift. Bạn có thể nhận sơ đồ ôn tập hoặc làm lại để củng cố kiến thức.'
                : 'Hãy quay lại các mục học về cấu trúc hình thái kinh tế - xã hội, lực lượng sản xuất, quan hệ sản xuất và quá trình lịch sử - tự nhiên.'}
            </p>
            <div className="game-page-actions">
              <button type="button" className="tab-btn outline" onClick={handleRetry}>
                Làm lại
              </button>
              <button type="button" className="tab-btn outline" onClick={onBack}>
                Quay lại bài học
              </button>
              {score >= 80 && (
                <button type="button" className="tab-btn red" onClick={() => onOpenGift('Game ôn tập học thuyết hình thái kinh tế - xã hội')}>
                  Mở Gift
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
