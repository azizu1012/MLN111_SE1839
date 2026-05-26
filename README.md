# Dự Án Giáo Dục: Hình Thế Kinh Tế - Xã Hội (Fullstack)

Dự án này là phiên bản tái tạo hoàn hảo trang chủ học tập về chủ đề **Hình thái Kinh tế - Xã hội** (môn Triết học Mác - Lênin) theo đúng thiết kế, tông màu học thuật đỏ crimson, đen, kem và trắng trong ảnh mẫu.

Dự án được xây dựng với cấu trúc **Fullstack chuyên nghiệp**:
- **Backend (Node.js & Express)**: Phục vụ API dữ liệu bài học động, hệ thống Game trắc nghiệm, và Gift phần thưởng học tập.
- **Frontend (React + Vite + Vanilla CSS)**: Giao diện UI/UX sắc nét, mượt mà, responsive hoàn toàn trên Mobile/Tablet và hỗ trợ mở các hộp thoại GAME/GIFT tương tác.

---

## Cấu Trúc Thư Mục

```text
├── backend/
│   ├── data/
│   │   └── contentData.json   # Dữ liệu chữ & bố cục chính xác từ ảnh mẫu
│   ├── server.js              # Server API Express
│   └── package.json           # Cấu hình backend
├── frontend/
│   ├── src/
│   │   ├── components/        # Các thành phần giao diện (Sections, Modals)
│   │   ├── App.jsx            # Điều phối trang & API fetch
│   │   ├── index.css          # Hệ thống CSS Design System
│   │   └── main.jsx           # Điểm khởi chạy React
│   ├── index.html             # Chứa phông chữ Google Fonts Outfit & Inter
│   ├── vite.config.js         # Cấu hình proxy đến backend port 5000
│   └── package.json           # Cấu hình frontend
├── package.json               # File điều phối khởi chạy toàn dự án
└── README.md                  # Hướng dẫn sử dụng
```

---

## Hướng Dẫn Chạy Local

Bạn có thể dễ dàng khởi chạy toàn bộ dự án trên máy tính của mình bằng các bước đơn giản sau:

### Bước 1: Cài đặt tất cả thư viện (Dependencies)
Mở một cửa sổ dòng lệnh (Terminal / Powershell) tại thư mục gốc của dự án (`New folder`) và chạy lệnh sau để tự động cài đặt thư viện cho cả Frontend và Backend:
```bash
npm run install:all
```

*(Hoặc nếu bạn muốn cài thủ công: chạy `npm install` tại thư mục `/backend` và `/frontend`)*.

---

### Bước 2: Khởi chạy dự án
Để chạy đồng thời cả Backend và Frontend chỉ với **một câu lệnh duy nhất**, hãy chạy lệnh này tại thư mục gốc:
```bash
npm run dev
```

Hệ thống sẽ tự động kích hoạt:
1. **Backend Server** tại địa chỉ: `http://localhost:5000`
2. **Frontend Client** tại địa chỉ: `http://localhost:3000` (Trình duyệt sẽ tự động mở trang web)

---

## Các Tính Năng Cao Cấp Được Tích Hợp

1. **Hiệu ứng chuyển động mượt mà (Micro-animations)**: Hover các card nâng cao, timeline tương tác, nút đỏ tỏa sáng nhẹ nhàng.
2. **Thiết kế Responsive hoàn hảo**: Hiển thị tuyệt đẹp trên cả Máy tính, Máy tính bảng (Tablet) và Điện thoại di động (Mobile).
3. **Menu Điều hướng thông minh (Sticky Header)**: Giúp người học nhanh chóng nhảy đến các phần bài học tương ứng chỉ với 1 click.
4. **Hệ thống GAME tương tác**: Bấm nút "GAME" ở mỗi phần sẽ mở ra một mini-quiz trắc nghiệm học thuật lấy câu hỏi trực tiếp từ Backend.
5. **Hệ thống GIFT phần thưởng**: Khi người học vượt qua bài trắc nghiệm ở tab GAME với điểm số từ 80/100 trở lên, tab GIFT sẽ được tự động mở khóa để cho phép tải về Sơ đồ tư duy PDF (kết nối trực tiếp tới API Backend).

---

## Hướng Dẫn Chia Sẻ Mã Nguồn Cho Người Khác

Dự án đã được tích hợp sẵn các công cụ và cấu hình tiêu chuẩn giúp bạn dọn dẹp và chia sẻ mã nguồn cho người khác một cách cực kỳ chuyên nghiệp và nhanh gọn.

### Bước 1: Dọn dẹp mã nguồn trước khi nén gửi đi
Thư mục `node_modules` chứa các thư viện tải về rất nặng (lên tới hàng trăm Megabyte) và **không nên** được nén chung vào file chia sẻ. Để tự động dọn dẹp toàn bộ các thư mục này và file đệm tạm thời chỉ bằng một lệnh duy nhất:
1. Mở Terminal tại thư mục gốc của dự án.
2. Chạy lệnh:
   ```bash
   npm run clean
   ```
3. Lệnh này sẽ tự động xóa sạch các thư mục `node_modules` ở root, backend, frontend cũng như file cache tự động sinh ra `philosophy_chunks.json` một cách an toàn và nhanh chóng. Dự án của bạn lúc này chỉ còn vài Megabyte, cực kỳ nhẹ để nén thành file `.zip` hoặc gửi qua email, Zalo, Google Drive...

### Bước 2: Hướng dẫn cho người nhận (Cách khởi chạy dự án)
Khi người khác nhận được file mã nguồn của bạn, họ chỉ cần làm theo các bước sau:
1. **Giải nén** file mã nguồn vào một thư mục trên máy tính.
2. **Cấu hình API Key (Dành cho Trợ lý AI)**:
   - Vào thư mục `/backend`, đổi tên file `.env.example` thành `.env`.
   - Mở file `.env` và nhập **Gemini API Key** của họ vào dòng `GEMINI_API_KEY="MÃ_API_KEY_CỦA_HỌ"`. (Có thể lấy khóa API miễn phí từ [Google AI Studio](https://aistudio.google.com/)).
3. **Cài đặt thư viện**: Mở Terminal tại thư mục gốc của dự án và chạy lệnh duy nhất dưới đây để tự động cài đặt tất cả thư viện cho cả root, backend và frontend:
   ```bash
   npm run install:all
   ```
4. **Khởi chạy ứng dụng**: Sau khi cài đặt hoàn tất, chạy lệnh dưới đây để bắt đầu trải nghiệm:
   ```bash
   npm run dev
   ```

