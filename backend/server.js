const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file if it exists (custom lightweight parser)
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        if (key && !key.startsWith('#')) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (err) {
  console.warn('Could not load .env file:', err.message);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const isProduction = process.env.NODE_ENV === 'production';
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');

if (isProduction) {
  app.use(express.static(frontendDist));
}

// Load educational content
const contentFilePath = path.join(__dirname, 'data', 'contentData.json');

app.get('/api/content', (req, res) => {
  try {
    const rawData = fs.readFileSync(contentFilePath, 'utf8');
    const content = JSON.parse(rawData);
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error reading content data file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve educational content.'
    });
  }
});

// Simple placeholder endpoint for Game
app.get('/api/game/questions', (req, res) => {
  res.json({
    success: true,
    questions: [
      {
        id: 1,
        question: "Hình thái kinh tế - xã hội dùng để chỉ điều gì?",
        options: [
          "Xã hội ở một nấc thang lịch sử nhất định với quan hệ sản xuất đặc trưng, lực lượng sản xuất tương ứng và kiến trúc thượng tầng phù hợp",
          "Một hình thức tổ chức lớp học trong nhà trường",
          "Một phương pháp quản trị doanh nghiệp hiện đại",
          "Một mô hình tâm lý cá nhân tách khỏi đời sống xã hội"
        ],
        answer: "Xã hội ở một nấc thang lịch sử nhất định với quan hệ sản xuất đặc trưng, lực lượng sản xuất tương ứng và kiến trúc thượng tầng phù hợp"
      },
      {
        id: 2,
        question: "Theo học thuyết hình thái kinh tế - xã hội, yếu tố nào là cơ sở nền tảng của sự vận động và phát triển xã hội?",
        options: [
          "Sản xuất vật chất",
          "Ý muốn chủ quan của cá nhân kiệt xuất",
          "Các nghi lễ tinh thần",
          "Sự thay đổi ngẫu nhiên của văn hóa"
        ],
        answer: "Sản xuất vật chất"
      },
      {
        id: 3,
        question: "Quy luật quan hệ sản xuất phù hợp với trình độ phát triển của lực lượng sản xuất nhấn mạnh điều gì?",
        options: [
          "Quan hệ sản xuất phải được xác lập, biến đổi phù hợp với trình độ của lực lượng sản xuất",
          "Quan hệ sản xuất luôn bất biến trong mọi thời đại",
          "Lực lượng sản xuất không liên quan đến công cụ lao động",
          "Kiến trúc thượng tầng quyết định trực tiếp mọi trình độ kỹ thuật"
        ],
        answer: "Quan hệ sản xuất phải được xác lập, biến đổi phù hợp với trình độ của lực lượng sản xuất"
      },
      {
        id: 4,
        question: "Cơ sở hạ tầng của xã hội là gì?",
        options: [
          "Toàn bộ những quan hệ sản xuất hợp thành cơ cấu kinh tế của xã hội",
          "Toàn bộ đường sá, cầu cống và công trình xây dựng",
          "Tổng số các tác phẩm văn học nghệ thuật",
          "Hệ thống quan điểm tôn giáo thuần túy"
        ],
        answer: "Toàn bộ những quan hệ sản xuất hợp thành cơ cấu kinh tế của xã hội"
      },
      {
        id: 5,
        question: "Kiến trúc thượng tầng được hình thành trên nền tảng nào?",
        options: [
          "Một cơ sở hạ tầng nhất định",
          "Sở thích cá nhân của từng người",
          "Các hiện tượng tự nhiên không qua đời sống sản xuất",
          "Một hệ thống ký hiệu không có quan hệ xã hội"
        ],
        answer: "Một cơ sở hạ tầng nhất định"
      },
      {
        id: 6,
        question: "Sự phát triển các hình thái kinh tế - xã hội được hiểu là quá trình gì?",
        options: [
          "Quá trình lịch sử - tự nhiên diễn ra theo các quy luật khách quan",
          "Quá trình hoàn toàn tùy tiện và không có quy luật",
          "Quá trình chỉ phụ thuộc vào đạo đức cá nhân",
          "Quá trình chỉ do kỹ thuật số hiện đại tạo ra"
        ],
        answer: "Quá trình lịch sử - tự nhiên diễn ra theo các quy luật khách quan"
      }
    ]
  });
});

// Simple placeholder endpoint for Gift
app.post('/api/gift/claim', (req, res) => {
  const { score } = req.body;
  if (score >= 80) {
    res.json({
      success: true,
      message: "Chúc mừng! Bạn đã mở khóa học liệu xuất sắc: PDF Sơ đồ tư duy Hình thái Kinh tế - Xã hội.",
      downloadUrl: "https://example.com/assets/mindmap-triethoc.pdf"
    });
  } else {
    res.json({
      success: false,
      message: "Bạn cần đạt từ 80 điểm trở lên trong Game để mở khóa quà tặng."
    });
  }
});

// Secure AI Chatbot Proxy Endpoint for Gemini with Local RAG (BM25)
const { searchRAG } = require('./utils/ragHelper');

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "⚠️ API Key chưa được cấu hình ở file .env của backend! Vui lòng gán giá trị GEMINI_API_KEY trong file .env."
    });
  }

  try {
    // 1. Perform local RAG Search in the Philosophy Textbook
    // Threshold set to 1.5 to catch relevant terms while ignoring unrelated chats
    const ragResults = searchRAG(message, 1.5);
    
    // 2. Build custom system instructions based on whether we found matches in the textbook
    let customInstruction = `Bạn là "Trợ lý Ôn thi Triết học Mác-Lênin" thông thái, thân thiện và tận tâm. Nhiệm vụ của bạn là giúp người học ôn luyện cho kỳ thi một cách hiệu quả nhất.

Khi người học hỏi về bất kỳ khái niệm hoặc nội dung nào liên quan đến môn Triết học, hãy trả lời theo cấu trúc rõ ràng sau:
1. 📖 <strong>Khái niệm</strong>: Giải thích định nghĩa/khái niệm một cách ngắn gọn, khoa học, đi thẳng vào trọng tâm.
2. 🔑 <strong>Từ khóa cốt lõi (Keywords)</strong>: Liệt kê dưới dạng danh sách (sử dụng <ul> và <li>) các từ khóa quan trọng nhất bắt buộc học viên phải nhớ và viết vào bài thi để đạt điểm cao.
3. 💡 <strong>Mẹo ôn thi/Ghi nhớ nhanh</strong>: Đưa ra một mẹo liên tưởng ngắn gọn, dễ nhớ để giúp học viên thuộc bài ngay lập tức.

Hãy trình bày câu trả lời thật chuyên nghiệp, dễ học bằng cách sử dụng các thẻ HTML cơ bản (như <strong>, <em>, <br>, <ul>, <li>) để định dạng câu trả lời đẹp mắt trong chatbox.`;

    if (ragResults.length > 0) {
      const primaryChunks = ragResults.filter(r => r.priority === 'high');
      const secondaryChunks = ragResults.filter(r => r.priority !== 'high');

      let context = '';
      if (primaryChunks.length > 0) {
        context += primaryChunks.map((r, idx) => `[Tài liệu CHÍNH - Học thuyết hình thái KT-XH ${idx + 1}]:\n${r.text}`).join('\n\n');
        context += '\n\n';
      }
      if (secondaryChunks.length > 0) {
        context += secondaryChunks.map((r, idx) => `[Tài liệu THAM KHẢO - Giáo trình Triết học ${idx + 1}]:\n${r.text}`).join('\n\n');
      }

      customInstruction += `\n\n[QUAN TRỌNG - SỬ DỤNG TÀI LIỆU CHÍNH THỨC DƯỚI ĐÂY ĐỂ TRẢ LỜI]:
Dưới đây là phần trích dẫn từ giáo trình Triết học Mác-Lênin. Hãy ƯU TIÊN sử dụng thông tin từ [Tài liệu CHÍNH] để trình bày Khái niệm và Từ khóa cốt lõi cho học viên. Các [Tài liệu THAM KHẢO] có thể dùng để bổ sung thêm nếu cần.

${context}

Lưu ý: Chỉ trích dẫn thông tin thực tế từ tài liệu trên. Tránh giải thích dài dòng lan man.`;
      console.log(`RAG: Tìm thấy ngữ cảnh từ giáo trình tổng quát. Bổ sung để tham khảo.`);
    } else {
      customInstruction += "\n\nLưu ý: Nếu người học hỏi các câu hỏi giao tiếp chung, xã giao hoặc ngoài giáo trình, hãy trả lời tự nhiên, thân thiện và khéo léo hướng họ tập trung quay trở lại ôn tập môn Triết học.";
      console.log(`🤖 Free-chat Mode: Không tìm thấy ngữ cảnh giáo trình phù hợp. AI trả lời tự do.`);
    }

    // 3. Request Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
        systemInstruction: {
          parts: [{
            text: customInstruction
          }]
        }
      })
    });

    const data = await response.json();

    if (!response.ok || !data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error("Gemini API Error:", JSON.stringify(data));
      return res.status(502).json({
        success: false,
        message: "Gemini API từ chối yêu cầu hoặc trả về kết quả không hợp lệ. Kiểm tra model ID và API key.",
        detail: data.error?.message || JSON.stringify(data)
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error("Error calling Gemini API with RAG:", error);
    res.status(500).json({
      success: false,
      message: "🔴 Có lỗi xảy ra khi kết nối tới Gemini API từ máy chủ Backend."
    });
  }
});

// Serve index.html for all non-API routes (SPA support) in production
if (isProduction) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Import preprocessor and start server after processing PDF
const preprocessPDF = require('./utils/pdfPreprocessor');
const { initRAG } = require('./utils/ragHelper');

async function startServer() {
  try {
    await preprocessPDF();
    initRAG();
  } catch (err) {
    console.error("Error preparing RAG on startup:", err);
  }

  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

startServer();

