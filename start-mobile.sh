#!/bin/bash

# Simple script to start roomait mobile app
echo "🏠 Starting roomait mobile app..."
echo ""

# Check if we're in the right directory
if [ ! -d "apps/mobile" ]; then
    echo "❌ Please run this from the project root directory"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "apps/mobile/node_modules" ]; then
    echo "📦 Installing mobile dependencies..."
    cd apps/mobile && npm install
    cd ..
fi

echo "🚀 Starting Expo development server..."
echo "📱 Use Expo Go app on your phone to scan the QR code"
echo "💻 Or press 'i' for iOS simulator, 'a' for Android emulator"
echo ""

cd apps/mobile && npm start
