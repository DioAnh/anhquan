# Hackathon Cursor HCMC

Ứng dụng web giáo dục kỹ năng sống cho trẻ em với tích hợp AI (Google Gemini).

## 📋 Yêu cầu hệ thống

- **Node.js**: >= 18.x
- **npm**: >= 9.x (hoặc yarn/pnpm)
- **Google Gemini API Key** (tùy chọn - để sử dụng tính năng AI)

## 🚀 Hướng dẫn chạy local

### Bước 1: Clone hoặc tải project

```bash
# Nếu có git repository
git clone <repository-url>
cd hackathoncursorHCMC

# Hoặc giải nén file zip vào thư mục
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

Lệnh này sẽ cài đặt tất cả các package cần thiết:
- React 19
- TypeScript
- Vite
- @google/genai
- Và các dependencies khác

### Bước 3: Cấu hình Environment Variables

Tạo file `.env` trong thư mục gốc của project:

```bash
# Windows (PowerShell)
New-Item -Path .env -ItemType File

# Linux/Mac
touch .env
```

Thêm nội dung sau vào file `.env`:

```env
GEMINI_API_KEY=your_api_key_here
```

**Lấy API Key:**
1. Truy cập: https://aistudio.google.com/app/apikey
2. Đăng nhập với Google account
3. Tạo API key mới
4. Copy và paste vào file `.env`

**Lưu ý:**
- Nếu không có API key, app vẫn chạy được nhưng các tính năng AI sẽ không hoạt động
- Không commit file `.env` lên git (đã có trong `.gitignore`)

### Bước 4: Chạy development server

```bash
npm run dev
```

Sau khi chạy lệnh, bạn sẽ thấy output tương tự:

```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
  ➜  press h + enter to show help
```

### Bước 5: Mở trình duyệt

Truy cập: **http://localhost:3000**

Bạn sẽ thấy:
1. **Splash Screen** (5 giây) - Màn hình chào mừng với animation
2. **Login Screen** - Nhập tên người dùng
3. **Dashboard** - Màn hình chính với các tính năng

## 📁 Cấu trúc Project

```
hackathoncursorHCMC/
├── components/              # React components
│   ├── SplashScreen.tsx    # Màn hình splash
│   ├── Login.tsx           # Màn hình đăng nhập
│   ├── Dashboard.tsx       # Dashboard chính
│   ├── ThemeSelector.tsx   # Chọn chủ đề
│   ├── TopicBrowser.tsx    # Duyệt các topic
│   ├── LessonPlayer.tsx    # Player bài học
│   ├── Quiz.tsx            # Component quiz
│   ├── ChallengeGame.tsx   # Game tình huống
│   └── ...                 # Các components khác
├── hooks/
│   └── useUserProgress.ts  # Hook quản lý tiến độ
├── services/
│   └── geminiService.ts    # Service tích hợp Gemini AI
├── types.ts                # TypeScript interfaces
├── constants.ts            # Dữ liệu themes, levels, achievements
├── App.tsx                 # Component chính
├── index.tsx               # Entry point
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── .env                    # Environment variables (tạo mới)
```

## 🎯 Tính năng chính

### 1. Hệ thống Bài học
- **6 Chủ đề kỹ năng sống**: Giao tiếp, Cảm xúc, Giải quyết vấn đề, An toàn, Tài chính, Tự lập
- **Nhiều Topics và Lessons** trong mỗi chủ đề
- **Video YouTube** tích hợp
- **AI-generated Summary** và Quiz

### 2. Gamification
- **Hệ thống điểm**: 100 điểm/bài học
- **20 Cấp độ**: Từ "Mầm Non Tập Sự" đến "Chiến Binh Siêu Cấp"
- **Achievements**: Huy hiệu cho các mốc thành tích
- **Streak**: Theo dõi chuỗi ngày học liên tiếp

### 3. Dashboard
- Thống kê tiến độ
- Daily Quiz challenge
- Challenge Game (tình huống)
- Level roadmap
- Achievement gallery

### 4. AI Features (cần API key)
- Tạo tóm tắt bài học
- Tạo câu hỏi quiz
- Tạo challenge games
- Tạo avatar
- Đánh giá câu trả lời

## 🛠️ Scripts có sẵn

```bash
# Development
npm run dev          # Chạy dev server (localhost:3000)

# Production
npm run build        # Build production
npm run preview      # Preview production build
```

## 🔧 Troubleshooting

### Lỗi: "Failed to resolve import @google/genai"
```bash
# Giải pháp: Cài đặt lại dependencies
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: "API_KEY is not set"
- Kiểm tra file `.env` đã được tạo chưa
- Kiểm tra tên biến: `GEMINI_API_KEY` (không phải `API_KEY`)
- Restart dev server sau khi tạo/sửa file `.env`

### Port 3000 đã được sử dụng
```bash
# Sửa port trong vite.config.ts hoặc
# Sử dụng port khác khi chạy:
npm run dev -- --port 3001
```

### Lỗi TypeScript
```bash
# Xóa cache và rebuild
rm -rf node_modules .vite
npm install
```

## 📝 Lưu ý

- **LocalStorage**: Tất cả dữ liệu được lưu trong browser localStorage
  - Tiến độ bài học
  - Điểm số và level
  - Streak
  - Achievements
  - Avatar

- **API Key**: 
  - Cần API key để sử dụng tính năng AI
  - Không có API key, app vẫn chạy nhưng AI features sẽ báo lỗi
  - API key được đọc từ file `.env`

- **Browser Support**: 
  - Chrome/Edge (khuyến nghị)
  - Firefox
  - Safari

## 🚀 Deploy

### Build production
```bash
npm run build
```

Output sẽ nằm trong thư mục `dist/`

### Deploy lên Vercel/Netlify
1. Push code lên GitHub
2. Kết nối repository với Vercel/Netlify
3. Thêm environment variable: `GEMINI_API_KEY`
4. Deploy

## 📞 Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra lại các bước cài đặt
2. Xem phần Troubleshooting
3. Kiểm tra console trong browser (F12) để xem lỗi chi tiết

## 📄 License

Project này được tạo cho Hackathon Cursor HCMC.

---

**Chúc bạn code vui vẻ! 🎉**
