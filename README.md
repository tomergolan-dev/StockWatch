# 📈 StockWatch

StockWatch is a modern full-stack web application for tracking stocks, managing personal watchlists, creating price alerts, and receiving notifications.

The system focuses on **clean UX, real-time updates, and scalable architecture**, similar to real-world financial platforms.

---

## 🚀 Features

### 🔍 Stock Search
- Search stocks by symbol or name
- Real-time suggestions (autocomplete-ready structure)
- View detailed stock data

---

### ⭐ Watchlist
- Add/remove stocks
- Personalized user watchlist
- Instant UI updates (no refresh)

---

### 🔔 Alerts System
- Create alerts based on stock price
- Active vs Triggered alerts separation
- Alert history tracking

---

### 🔔 Notifications
- Notification panel (bell icon)
- Mark as read/unread
- Tracks alert triggers

---

### 📊 Stock Page
- Detailed stock view
- TradingView chart integration
- Auto dark/light sync
- Watchlist-aware actions (dynamic UI)

---

### 🎨 UI / UX Highlights
- Modern, minimal design
- Fully responsive (mobile-first)
- Dark / Light / Auto theme (based on sunrise/sunset 🌅)
- Smooth modals and interactions
- Component-based architecture

---

## 🧱 Tech Stack

### Frontend
- React + TypeScript
- Vite
- Context API (Auth + Theme)
- Axios
- Lucide Icons

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- REST API architecture

### External APIs
- Finnhub (stock data)
- TradingView (charts)

---

## 🏗️ Architecture

Project follows a **feature-based structure**:
src/
features/
stocks/
watchlist/
alerts/
notifications/
components/
layout/
ui/
pages/
hooks/
context/

### Key Concepts:
- Separation of concerns (logic / layout / UI)
- Reusable components (Card, List, Modal)
- Global state via Context
- API abstraction layer

---

## 🔐 Authentication

- JWT-based authentication
- Protected routes
- UI adapts instantly on login/logout

---

## ⚡ UX Improvements Implemented

- Logout confirmation modal
- Instant UI sync after logout
- Disabled / hidden actions based on user state
- Modal-based interactions instead of page navigation
- Consistent card design across the app

---

## 🌗 Theme System

- Light / Dark / Auto mode
- Auto mode uses geolocation + sunrise/sunset logic
- Theme persists across refresh
- Charts sync dynamically with theme

---

## 📦 Installation

```bash
git clone https://github.com/your-username/StockWatch.git
cd StockWatch
npm install
npm run dev

---

## 🧪 Future Improvements
	•	Real-time stock updates (WebSockets)
	•	Advanced charts
	•	Portfolio tracking
	•	Performance optimizations
	•	Push notifications

## 👨‍💻 Author

Tomer Golan
Full Stack Developer
