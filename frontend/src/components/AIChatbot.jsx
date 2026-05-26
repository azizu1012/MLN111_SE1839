import React, { useState, useRef, useEffect } from 'react';

// ----------------------------------------------------
// GEMINI AI ASSISTANT CONFIGURATION & CODES
// ----------------------------------------------------
// ĐẶT API KEY CỦA GEMINI Ở ĐÂY:
const GEMINI_API_KEY = "YOUR_API_KEY_HERE"; 

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ lý học tập AI chuyên về học thuyết <strong>Hình thái Kinh tế - Xã hội</strong> của Mác - Lênin. Bạn có bất kỳ câu hỏi nào cần tra cứu hoặc giải đáp không?'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendQuickQuestion = (questionText) => {
    sendMessage(questionText);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage(inputVal);
    }
  };

  const sendMessage = async (textToSend) => {
    const text = textToSend ? textToSend.trim() : inputVal.trim();
    if (!text) return;

    // Append user message
    const userMsgId = Date.now();
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text }]);
    setInputVal('');
    setIsLoading(true);

    // Append typing bubble placeholder
    const aiMsgId = userMsgId + 1;
    setMessages(prev => [...prev, { id: aiMsgId, sender: 'ai', text: 'Đang suy nghĩ...', isLoading: true }]);

    const isClientKeyConfigured = GEMINI_API_KEY && GEMINI_API_KEY !== "YOUR_API_KEY_HERE" && GEMINI_API_KEY.trim() !== "";

    try {
      let aiText = '';
      if (isClientKeyConfigured) {
        // Direct Client-Side Call (useful for quick static testing)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: text }] }],
            systemInstruction: {
              parts: [{
                text: "Bạn là một giảng viên Triết học Mác-Lênin ảo thân thiện, thông thái. Nhiệm vụ của bạn là giảng dạy, giải thích các khái niệm triết học khoa học, đặc biệt là lý thuyết hình thái kinh tế - xã hội, sản xuất vật chất, lực lượng sản xuất, quan hệ sản xuất, cơ sở hạ tầng, kiến trúc thượng tầng... Hãy trả lời bằng tiếng Việt một cách khoa học, ngắn gọn, súc tích, dễ nhớ. Sử dụng các thẻ HTML cơ bản (như <strong>, <em>, <br>, <ul>, <li>) để định dạng câu trả lời đẹp mắt trong chatbox."
              }]
            }
          })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
          aiText = data.candidates[0].content.parts[0].text;
        } else {
          console.error("Gemini API Error details:", data);
          throw new Error("Không lấy được kết quả từ Gemini API.");
        }
      } else {
        // Secure Backend Proxy Call (loads key from backend .env)
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: text })
        });
        const data = await response.json();
        if (data.success && data.data && data.data.candidates && data.data.candidates[0].content && data.data.candidates[0].content.parts[0]) {
          aiText = data.data.candidates[0].content.parts[0].text;
        } else {
          console.error("Backend Proxy Error details:", data);
          throw new Error(data.message || "Không thể gọi Gemini API qua cổng Backend.");
        }
      }

      // Basic markdown parsing to HTML tags for better chat visibility
      aiText = aiText
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');

      setMessages(prev => 
        prev.map(m => m.id === aiMsgId ? { ...m, isLoading: false, text: aiText } : m)
      );
    } catch (err) {
      console.error("Assistant chat error:", err);
      setMessages(prev => 
        prev.map(m => m.id === aiMsgId ? { 
          ...m, 
          isLoading: false, 
          text: `🔴 Có lỗi xảy ra: ${err.message || 'Lỗi mạng hoặc cấu hình API Key.'}<br><small style="color: #666">Hệ thống đang cố gắng gọi API bảo mật thông qua file .env tại Backend. Hãy chắc chắn bạn đã điền GEMINI_API_KEY trong file /backend/.env và khởi động máy chủ bằng lệnh 'npm run dev'.</small>` 
        } : m)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-chat-widget">
      <button className="ai-chat-button" onClick={toggleChat}>
        💬 Trợ Lý Triết Học AI
      </button>
      
      <div 
        className="ai-chat-window" 
        id="aiChatWindow"
        style={{ display: isOpen ? 'flex' : 'none' }}
      >
        <div className="ai-chat-header">
          <div className="ai-chat-header-title">
            <span className="ai-chat-status-dot"></span>
            TRỢ LÝ HỌC TẬP AI
          </div>
          <button className="ai-chat-close" onClick={toggleChat}>×</button>
        </div>
        
        <div className="ai-chat-messages" id="aiChatMessages">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`ai-chat-bubble ${msg.sender} ${msg.isLoading ? 'loading' : ''}`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="ai-chat-quick-hints">
          <button className="ai-chat-hint-btn" onClick={() => sendQuickQuestion('Hình thái kinh tế - xã hội là gì?')}>Hình thái KT-XH là gì?</button>
          <button className="ai-chat-hint-btn" onClick={() => sendQuickQuestion('Cơ sở vật chất của xã hội là gì?')}>Cơ sở vật chất xã hội?</button>
          <button className="ai-chat-hint-btn" onClick={() => sendQuickQuestion('5 hình thái KT-XH lịch sử là gì?')}>5 hình thái lịch sử?</button>
        </div>
        
        <div className="ai-chat-input-bar">
          <input 
            type="text" 
            className="ai-chat-input" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Hỏi trợ lý về bài học..." 
            onKeyPress={handleKeyPress}
          />
          <button className="ai-chat-send-btn" onClick={() => sendMessage()}>Gửi</button>
        </div>
      </div>
    </div>
  );
}
