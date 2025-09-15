# 🏠 roomait Development CLI Guide

Welcome to the roomait development environment! This guide covers all the CLI tools and commands available for easy development.

## 🚀 Quick Start

### Option 1: Interactive Setup (Recommended)
```bash
npm run setup
```
This runs an interactive setup script that guides you through:
- Dependency installation
- Database setup  
- EAS configuration
- Development server startup

### Option 2: Individual Commands
```bash
# Check system requirements
npm run check

# Install all dependencies
npm install
cd apps/backend && pip install -r requirements.txt
cd ../mobile && npm install

# Start development
npm run dev
```

## 📋 Available Commands

### 🔧 Setup & Installation
```bash
npm run setup           # Interactive setup wizard
npm run check           # Check system requirements  
npm run dev:full        # Full setup + start servers
npm run help            # Show all available commands
```

### 🏃‍♂️ Development Servers
```bash
npm run dev             # Start both backend + mobile
npm run dev:backend     # Start FastAPI backend only
npm run dev:mobile      # Start Expo mobile app only
npm start               # Alias for npm run dev
```

### 🗄️ Database Management
```bash
npm run db:init         # Initialize database tables
npm run db:seed         # Seed with sample furniture data
npm run db:reset        # Reset and reseed database
```

### 📱 Mobile App (EAS)
```bash
npm run mobile:build:ios        # Build for iOS
npm run mobile:build:android    # Build for Android  
npm run mobile:build:all        # Build for both platforms
npm run mobile:submit:ios       # Submit to App Store
npm run mobile:submit:android   # Submit to Google Play
```

### 🔍 Monitoring & Health
```bash
npm run health          # Check if services are running
npm run logs:backend    # View backend logs
```

### 🧹 Utilities
```bash
npm run clean           # Clean all node_modules
npm test                # Run tests (coming soon)
npm run build           # Build both apps for production
```

## 🌐 Development URLs

- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Mobile App**: Scan QR code in terminal with Expo Go
- **Railway Dashboard**: https://railway.app

## 📱 Mobile Development

### Running on Device
1. Install Expo Go app on your phone
2. Run `npm run dev:mobile`
3. Scan the QR code with your phone

### Running on Simulator
```bash
cd apps/mobile
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Browser version
```

## 🚀 Deployment

### Backend (Railway)
Your backend auto-deploys to Railway when you push to GitHub.

### Mobile (EAS)
```bash
# First time setup
eas login
cd apps/mobile
eas init --id 44c5fe12-8e22-47ba-aed3-8672e275f568

# Building
npm run mobile:build:ios     # iOS build
npm run mobile:build:android # Android build
```

## 🔧 Environment Setup

### Required Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://user:pass@host:port/db
OPENAI_API_KEY=your_openai_key_here
CORS_ORIGINS=http://localhost:3000,http://localhost:19006
```

### Database Setup
1. Get your `DATABASE_URL` from Railway PostgreSQL deployment
2. Set it in your environment or `.env` file
3. Run `npm run db:init` to create tables
4. Run `npm run db:seed` to add sample data

## 🐛 Troubleshooting

### Common Issues

**"Missing script" error**
- Make sure you're in the root directory
- Run `npm install` first

**Database connection failed**
- Check your `DATABASE_URL` is set correctly
- Verify Railway PostgreSQL is running

**Mobile app won't start**
- Try `cd apps/mobile && npm install`
- Clear Expo cache: `npx expo start --clear`

**EAS login failed**
- Make sure you have valid Expo account credentials
- Try `eas logout` then `eas login`

### Getting Help
```bash
npm run help                    # Show all commands
node scripts/dev.js help       # Detailed CLI help
./setup.sh                     # Interactive setup
```

## 🎯 Development Workflow

### Daily Development
1. `npm run dev` - Start both servers
2. Make your changes
3. Test on device/simulator
4. Commit and push to deploy backend

### Adding New Features
1. `npm run db:reset` - Fresh database
2. Develop feature
3. Test thoroughly
4. `npm run mobile:build:ios` - Test build

### Production Deployment
1. Test everything locally
2. Push to GitHub (auto-deploys backend)
3. `npm run mobile:build:all` - Build mobile apps
4. `npm run mobile:submit:ios` - Submit to stores

## 🆘 Need Help?

- Check the main README.md for project overview
- Run `npm run help` for command reference
- Look at `/docs` folder for detailed documentation
- Check Railway logs for backend issues
- Use Expo CLI docs for mobile issues

Happy coding! 🚀
