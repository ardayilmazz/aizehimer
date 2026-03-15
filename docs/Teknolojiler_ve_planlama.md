# Teknolojiler ve Planlama

## Önerilen Teknoloji Stack'i

### 1. React Framework ve Build Tool
- ✅ **React 18+** (Güncel versiyon)
- ✅ **Vite** (Create React App yerine)
  - Daha hızlı build süreleri
  - Daha az konfigürasyon
  - Modern ES modules desteği

### 2. Routing
- ✅ **React Router v6**
  - Sayfa yönlendirmesi için
  - Protected routes (giriş kontrolü)
  - Basit ve yaygın kullanım

### 3. State Management
- ✅ **Context API + useReducer** (Redux gerekmez)
  - Local Storage ile entegrasyon kolay
  - Küçük-orta ölçekli projeler için yeterli
  - Ekstra dependency yok

**Alternatif:** Zustand (daha hafif, isteğe bağlı)

### 4. Form Yönetimi
- ✅ **React Hook Form**
  - Performanslı
  - Az kod yazımı
  - Validasyon desteği

### 5. Tarih/Saat İşlemleri
- ✅ **date-fns**
  - Hafif ve modüler
  - Moment.js'ten daha küçük
  - Hatırlatıcılar için mükemmel

**Alternatif:** Day.js (daha küçük, benzer API)

### 6. UI Kütüphaneleri (Opsiyonel)
- ✅ **React Icons**
  - Çok sayıda ikon
  - Kolay kullanım

- ✅ **Headless UI** (Opsiyonel)
  - Erişilebilirlik odaklı
  - Stil kontrolü sizde

### 7. Local Storage Yönetimi
- ✅ **Custom Hook: `useLocalStorage`**
  - React state ile senkronizasyon
  - Basit ve özelleştirilebilir

### 8. API Entegrasyonu (Google Gemini)
- ✅ **Axios** veya **Fetch API**
  - Axios: Daha kolay hata yönetimi
  - Fetch: Native, ekstra dependency yok

### 9. Chat UI
- ✅ **Custom Component** (Önerilen)
  - Mevcut tasarımınızı korur
  - Tam kontrol

**Alternatif:** react-chatbot-kit (hızlı başlangıç için)

### 10. Utility Kütüphaneleri
- ✅ **Lodash** (Opsiyonel)
  - Array/object işlemleri
  - Sadece ihtiyaç duyulan fonksiyonları import edin

---

## Önerilen Paket Yapısı

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "react-hook-form": "^7.48.0",
    "date-fns": "^2.30.0",
    "axios": "^1.6.0",
    "react-icons": "^4.12.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}

## Proje Yapısı Önerisi

src/
├── components/
│   ├── Chat/
│   │   ├── ChatContainer.jsx
│   │   ├── ChatMessage.jsx
│   │   └── ChatInput.jsx
│   ├── Reminders/
│   │   ├── ReminderList.jsx
│   │   └── ReminderCard.jsx
│   ├── Stats/
│   │   └── StatCard.jsx
│   └── Layout/
│       ├── Header.jsx
│       └── Footer.jsx
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   └── Settings.jsx
├── hooks/
│   ├── useLocalStorage.js
│   ├── useAuth.js
│   └── useGemini.js
├── context/
│   ├── AuthContext.jsx
│   └── ReminderContext.jsx
├── utils/
│   ├── storage.js
│   ├── dateHelpers.js
│   └── validators.js
├── services/
│   └── geminiApi.js
└── styles/
    └── index.css

## Önemli Notlar

### ❌ Kullanmayın

    - Redux (Gereksiz karmaşıklık)
    - Material-UI / Ant Design (Tasarımınızı değiştirir)
    - Moment.js (Büyük ve eski)
    - Class Components (Function Components + Hooks kullanın)

### ⚠️ Dikkat Edilmesi Gerekenler

    - Local Storage Limiti: ~5-10MB
    - Performans: Büyük listeler için virtual scrolling (react-window)
    - SEO: React Router ile hash routing yerine browser routing
    - Bundle Size: Tree-shaking için named imports kullanın

### Geliştirme Sırası Önerisi

    - ✅ Vite + React kurulumu
    - ✅ React Router entegrasyonu
    - ✅ Mevcut sayfaları component'lere dönüştürme
    - ✅ Context API ile state management
    - ✅ Custom hooks (useLocalStorage, useAuth)
    - ✅ Chat component'i
    - ✅ Reminder yönetimi
    - ✅ Google Gemini API entegrasyonu
    - ✅ Optimizasyon ve test

### Ekstra Öneriler

    - Error Boundary: Hata yakalama için
    - Loading States: UX için
    - Toast Notifications: Bildirimler için (react-hot-toast)
    - Form Validation: Yup veya Zod

## Sonuç

Bu stack ile projeniz:

    - ✅ Sade ve anlaşılır olacak
    - ✅ Performanslı çalışacak
    - ✅ Bakımı kolay olacak
    - ✅ Staj projesi için uygun olacak