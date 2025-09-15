# 🏠 roomait - AR Interior Design for Students

[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-51-purple.svg)](https://expo.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green.svg)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

**Production-ready AR interior design app for college students**

## 🎯 What is roomait?

roomait is an AR furniture placement app that helps college students visualize and shop for furniture that fits their space and budget. Using real motion sensors and 3D rendering, students can:

- **Scan their room** using device motion sensors
- **Place 3D furniture models** with touch-based placement
- **See real products** that match their style and budget
- **Buy directly** from integrated retailers

## ✨ Key Features

### 🔍 **Real AR Surface Detection**
- Uses device accelerometer & gyroscope for surface detection
- Three.js hardware-accelerated 3D rendering
- Touch-based furniture placement with raycasting
- Automatic fallback system for unsupported devices

### 📱 **Production Mobile App**
- React Native with Expo managed workflow
- Real camera integration with 3D overlay
- Comprehensive error handling and permissions
- Cross-platform support (iOS/Android)

### 🔐 **Secure Authentication**
- Auth0 integration with social login
- Proper callback URL configuration
- Works in development and production builds

### 🛍️ **Smart Shopping Integration**
- AI-powered product recommendations
- Price comparison across retailers
- Student-friendly budget filtering
- Direct purchase links

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+ and pip
- Expo CLI (`npm install -g @expo/cli`)
- iOS/Android device or simulator

### 1. Clone & Install
```bash
git clone https://github.com/saswath-06/roommait.git
cd roomait
npm install
```

### 2. Backend Setup
```bash
cd apps/backend
pip install -r requirements.txt
cp env.example .env
# Edit .env with your configuration
uvicorn src.main:app --reload
```

### 3. Mobile App Setup
```bash
cd apps/mobile
npm install
npx expo start
```

### 4. Scan QR Code
- Open Expo Go app on your device
- Scan the QR code from the terminal
- Grant camera and motion permissions

## 📱 App Flow

1. **Welcome** → Create account or sign in
2. **AR Permission** → Grant camera access  
3. **Calibration** → 2-second sensor initialization
4. **Surface Detection** → Move device to detect floors/walls
5. **Furniture Placement** → Tap surfaces to place 3D models
6. **Shopping** → Tap placed items to see real products
7. **Purchase** → Buy directly from retailers

## 🏗️ Architecture

```
roomait/
├── apps/
│   ├── mobile/          # React Native + Expo app
│   │   ├── app/         # App screens (Expo Router)
│   │   ├── src/         # Components, contexts, config
│   │   └── assets/      # Images, fonts, models
│   └── backend/         # FastAPI server
│       ├── src/         # API routes, models, services
│       └── requirements.txt
├── packages/            # Shared types and constants
├── docs/               # All documentation
└── scripts/            # Deployment and dev scripts
```

## 🔧 Tech Stack

### Frontend
- **React Native** + **Expo** (managed workflow)
- **Three.js** + **expo-gl** (3D rendering)
- **DeviceMotion** (real sensor data)
- **TypeScript** (type safety)
- **NativeWind** (styling)

### Backend  
- **FastAPI** (Python API framework)
- **PostgreSQL** (database)
- **OpenAI API** (AI recommendations)
- **Railway** (deployment)

### AR Technology
- **Motion sensors** (accelerometer/gyroscope)
- **Camera integration** (live video feed)
- **3D surface detection** (gravity vector analysis)
- **Touch raycasting** (precise placement)

## 📚 Documentation

All detailed documentation is in the [`docs/`](./docs/) folder:

- **[Project Scope](./docs/projectscope.md)** - Complete vision, market analysis, technical architecture
- **[MVP Features](./docs/mvp.md)** - Core features, user stories, demo strategy  
- **[Design System](./docs/design.md)** - UI/UX specs, mockups, technical requirements
- **[Auth0 Setup](./docs/AUTH0_COMPLETE_CALLBACK_URLS.md)** - Authentication configuration
- **[Deployment Guide](./docs/EXPO_DEPLOYMENT_GUIDE.md)** - Production deployment steps

## 🎯 Target Users

**Primary:** College students (ages 18-25)
- Living in dorms, apartments, shared housing
- Budget: $15-200 per furniture purchase  
- Tech-savvy, mobile-first generation
- Need space-efficient furniture solutions

**Market:** 20+ million US college students, $13B housing market

## 🚦 Development Status

### ✅ Completed
- [x] Real AR surface detection with motion sensors
- [x] 3D furniture placement with Three.js rendering
- [x] Touch-based interaction with raycasting
- [x] Auth0 authentication with social login
- [x] Production-ready error handling and fallbacks
- [x] Cross-platform mobile app (iOS/Android)
- [x] Comprehensive documentation

### 🔄 In Progress
- [ ] Backend API integration
- [ ] AI product recommendation system
- [ ] Retailer integration (Amazon, IKEA, Wayfair)
- [ ] User onboarding flow

### 📋 Roadmap
- [ ] Social features (room sharing)
- [ ] Advanced AR features (occlusion, lighting)
- [ ] University partnerships
- [ ] Web dashboard

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Contact

**Project Link:** [https://github.com/saswath-06/roommait](https://github.com/saswath-06/roommait)

---

**Built with ❤️ for college students everywhere** 🎓

*Making dorm rooms feel like home, one AR placement at a time.*
