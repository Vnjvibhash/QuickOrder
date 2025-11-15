# 🚀 QuickOrder — React Native Application

QuickOrder is a high-performance React Native application built for smooth, fast, and intuitive ordering experiences.  
It uses a scalable folder structure, reusable UI components, optimized lists, and modern TypeScript architecture.

## ✨ Features

- ⚡ **Smooth, high-FPS UI** (zero frame drops using optimized FlatList)
- 📦 **Modular folder structure** for scalability and team collaboration
- 🎨 **Centralized theming system** (colors, typography, spacing)
- 🔄 **Pull-to-refresh support**
- 📡 **Local JSON + future API-ready integration**
- 🧭 **React Navigation** with strongly typed routes
- 🔐 **SafeArea + layout adapters** to support all devices
- 💾 **Reusable components** (Card, Tag, ReactionBar, PostCardDetailed)
- 🔥 **Optimistic UI Updates** for like/dislike
- 📲 **Detail screen with native or custom back button**
- 🌍 **Multi-language ready structure**

---

## 📁 Folder Structure
QuickOrder/
│── src/
│ ├── assets/
│ ├── components/
│ │ ├── atoms/
│ │ ├── molecules/
│ │ └── organisms/
│ ├── data/
│ │ └── posts.json
│ ├── navigation/
│ │ ├── index.tsx
│ │ └── types.ts
│ ├── screens/
│ │ ├── HomeScreen.tsx
│ │ └── PostDetailScreen.tsx
│ ├── services/
│ │ └── api.ts
│ ├── theme/
│ │ ├── index.ts
│ │ ├── colors.ts
│ │ └── spacing.ts
│ ├── types/
│ │ └── index.ts
│ └── utils/
│ └── timeAgo.ts
│
└── README.md


---

## 🛠️ Tech Stack

- **React Native**
- **TypeScript**
- **React Navigation**
- **@react-native-safe-area-context**
- **Local JSON data / future API-ready**
- **Hermes Engine (Optional)**

---

## 🚀 Getting Started

### 1️⃣ Install dependencies

```sh
npm install
# or
yarn install
```

### 2️⃣ Start Metro bundler
```sh
npm start
```

### 3️⃣ Run on Android
```sh
npm run android
```

### 4️⃣ Run on iOS
```sh
npm run ios