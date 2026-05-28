# Hướng Dẫn Deploy lên Render

## Cách 1: Deploy tự động (khuyên dùng)

1. **Tạo tài khoản Render** tại https://render.com (đăng nhập bằng GitHub)

2. **Bấm "New +" > "Blueprint"** (dùng file render.yaml có sẵn)

3. **Chọn repository**: `azizu1012/MLN111_SE1839`

4. **Thêm Environment Variable** (bắt buộc):
   - Key: `GEMINI_API_KEY`
   - Value: `<API key của bạn>` (lấy từ Google AI Studio)

5. **Bấm "Apply"** - Render sẽ tự động:
   - Build frontend (React → static files)
   - Cài đặt dependencies cho backend
   - Triển khai server

6. **Sau ~5 phút**, Render sẽ cung cấp URL dạng:
   ```
   https://mln-hinh-thai-kinh-te-xa-hoi.onrender.com
   ```

---

## Cách 2: Deploy thủ công (nếu Blueprint không hoạt động)

### Bước 1: Tạo Web Service
- Dashboard Render > **New +** > **Web Service**
- Kết nối GitHub repo `azizu1012/MLN111_SE1839`

### Bước 2: Cấu hình
| Field | Value |
|-------|-------|
| **Name** | `mln-hinh-thai-kinh-te-xa-hoi` |
| **Runtime** | Node |
| **Region** | Singapore (gần VN nhất) |
| **Branch** | `main` |
| **Plan** | Free |

### Bước 3: Build & Start Command
```
Build Command:
cd backend && npm install && cd ../frontend && npm install && npm run build

Start Command:
cd backend && NODE_ENV=production node server.js
```

### Bước 4: Environment Variables
Thêm các biến sau:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `GEMINI_API_KEY` | Key Gemini của bạn |

### Bước 5: Bấm "Deploy"

---

## Cấu trúc file cho Render

```
MLN/
├── render.yaml              # Config tự động (dùng cho Blueprint)
├── package.json             # Root (chỉ chứa concurrently)
├── backend/
│   ├── server.js            # Server chính
│   ├── package.json
│   └── .env                 # Không cần trên Render (dùng env vars)
├── frontend/
│   ├── src/
│   ├── vite.config.js       # Proxy chỉ dùng cho dev
│   └── package.json
└── *.pdf                    # File PDF cho RAG system
```

## Lưu ý quan trọng

1. **Gemini API Key**: Vào Render Dashboard > Web Service > Environment, thêm `GEMINI_API_KEY`
2. **Free Plan hạn chế**:
   - Server sẽ "ngủ" sau 15 phút không truy cập
   - Lần đầu truy cập lại mất ~30-60s để khởi động
3. **Custom Domain** (tùy chọn): Settings > Custom Domain
4. **RAG System**: PDF được xử lý tự động khi deploy, lần đầu sẽ lâu hơn ~10-20s

## Kiểm tra sau deploy

- `https://domain-cua-ban.onrender.com/` → Trang chủ
- `https://domain-cua-ban.onrender.com/api/content` → API content (test)
- `https://domain-cua-ban.onrender.com/api/game/questions` → Game API (test)

## Troubleshooting

**Lỗi 502 Bad Gateway**
- Vào Render Dashboard > Logs, kiểm tra backend có crash không
- Thử restart service

**Lỗi API Key**
- Kiểm tra `GEMINI_API_KEY` đã được thêm trong Environment Variables chưa
- Key phải có quyền truy cập Gemini API

**Lỗi PDF không load**
- Kiểm tra file `.pdf` có trong thư mục gốc của repo không
- Xem logs: `RAG: ... chunks`
