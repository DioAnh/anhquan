# Hackathon Cursor HCMC

Ứng dụng web với luồng khởi động: Splash Screen → Login → Dashboard

## 🚀 Cài đặt và Chạy Project

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy project trên localhost
```bash
npm run dev
```

Project sẽ chạy tại: **http://localhost:3000**

### 3. Build production
```bash
npm run build
```

### 4. Preview production build
```bash
npm run preview
```

## 📁 Cấu trúc Project

```
hackathoncursorHCMC/
├── components/
│   ├── SplashScreen.tsx    # Màn hình splash (5 giây)
│   ├── Login.tsx           # Màn hình đăng nhập
│   └── Dashboard.tsx       # Dashboard chính
├── App.tsx                 # Component chính, routing logic
├── index.tsx               # Entry point
├── index.html              # HTML template
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🎯 Luồng Hoạt Động

1. **Splash Screen**: Hiển thị 5 giây với animation
2. **Login**: Nhập tên người dùng
3. **Dashboard**: Màn hình chính sau khi đăng nhập

## 🛠️ Công nghệ

- **React 19** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Google Fonts** (Fredoka, Quicksand)

## 📝 Lưu ý

- Dữ liệu được lưu trong `localStorage`
- Tên người dùng và trạng thái đăng nhập được lưu tự động
