# 📱 Expo Deployment Guide for roomait

This guide shows you how to deploy your Expo React Native app so you don't need to run it locally every time.

## 🚀 Deployment Options

### 1. **EAS Updates (Recommended for Development)**
- **What**: Over-the-air updates that push instantly to users
- **Best for**: Code changes, bug fixes, new features
- **Speed**: Instant deployment (2-3 minutes)
- **Cost**: Free for personal use

### 2. **EAS Build + Expo Go**
- **What**: Creates shareable builds that work with Expo Go app
- **Best for**: Testing with others, demos
- **Speed**: 5-15 minutes
- **Cost**: Free tier available

### 3. **EAS Build + App Stores**
- **What**: Full native builds for iOS App Store and Google Play
- **Best for**: Production releases
- **Speed**: 20-30 minutes + store review
- **Cost**: $99/year (iOS) + $25 one-time (Android)

## 🛠️ Quick Setup

### Step 1: Install EAS CLI
```bash
npm install -g @expo/eas-cli
```

### Step 2: Login to Expo
```bash
cd apps/mobile
eas login
```

### Step 3: Your First Deployment
```bash
# For quick code updates (recommended)
npm run update

# For full builds
npm run deploy:preview
```

## 📋 Available Commands

### Quick Updates (OTA)
```bash
# Update development version
npm run update:dev

# Update preview version  
npm run update:preview

# Update production version
npm run update:prod

# Auto-select branch
npm run update
```

### Full Builds
```bash
# Development build (internal testing)
npm run deploy:dev

# Preview build (shareable with QR code)
npm run deploy:preview

# Production build (app stores)
npm run deploy:prod

# Interactive deployment script
npm run deploy
```

## 🎯 Recommended Workflow

### For Daily Development:
1. **Code changes** → `npm run update:dev`
2. **Share with team** → `npm run deploy:preview`
3. **Production ready** → `npm run deploy:prod`

### For Major Releases:
1. **Test locally** → `npm start`
2. **Deploy preview** → `npm run deploy:preview`
3. **Build production** → `npm run deploy:prod`
4. **Submit to stores** → `eas submit --platform all`

## 🤖 Automated Deployment

### GitHub Actions (Already Set Up!)
- **Push to main** → Automatic production update
- **Open PR** → Automatic preview deployment
- **Zero configuration needed**

### Setup GitHub Secrets:
1. Go to your GitHub repo → Settings → Secrets
2. Add `EXPO_TOKEN`:
   - Run `eas whoami` to get your username
   - Go to https://expo.dev/accounts/[username]/settings/access-tokens
   - Create token → Copy → Add as GitHub secret

## 📱 How Users Access Your App

### Option 1: Expo Go (Easiest)
1. Install "Expo Go" from app store
2. Scan QR code from EAS dashboard
3. App opens directly in Expo Go

### Option 2: Development Build
1. Download `.apk` (Android) or install via TestFlight (iOS)
2. Install directly on device
3. Works like a real app

### Option 3: Production Build
1. Submit to app stores
2. Users download from App Store/Google Play
3. Regular app experience

## 🔗 Important URLs

- **EAS Dashboard**: https://expo.dev/accounts/[username]/projects/roomait
- **Build Status**: Check builds at expo.dev
- **Analytics**: Built-in usage analytics
- **Documentation**: https://docs.expo.dev/eas/

## 🎮 Testing Your Deployment

### Test on Different Devices:
```bash
# Generate QR code for testing
npm run deploy:preview
```

1. **iOS**: Use camera app to scan QR
2. **Android**: Use Expo Go app to scan QR
3. **Share**: Send QR link to teammates

### Test OTA Updates:
```bash
# Deploy update
npm run update:preview

# Check update in app
# Pull down to refresh in Expo Go
```

## 🚨 Troubleshooting

### Build Failed?
```bash
# Clear EAS cache
eas build --clear-cache

# Check build logs
eas build:list
```

### Update Not Working?
```bash
# Check update status
eas update:list

# Force new update
eas update --auto --force
```

### Auth Issues?
```bash
# Re-login
eas logout
eas login
```

## 💡 Pro Tips

1. **Use Preview Builds** for sharing with non-developers
2. **Use Updates** for quick fixes and features
3. **Test on real devices** before production
4. **Monitor analytics** in EAS dashboard
5. **Set up Expo notifications** for deployment alerts

## 🎉 Your App URLs

Once deployed, your app will be available at:

- **Development**: https://expo.dev/@[username]/roomait?serviceType=classic&distribution=expo-go&scheme=roomait&channel=development
- **Preview**: https://expo.dev/@[username]/roomait?serviceType=classic&distribution=expo-go&scheme=roomait&channel=preview  
- **Production**: https://expo.dev/@[username]/roomait?serviceType=classic&distribution=expo-go&scheme=roomait&channel=production

**No more `npm start` needed!** 🎊

Just deploy once and share the link! Users can access your app anytime without you running anything locally.
