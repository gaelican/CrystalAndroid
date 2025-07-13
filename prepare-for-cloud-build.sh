#!/bin/bash

echo "🚀 Preparing CrystalAndroid for cloud build..."

# Clean unnecessary files
echo "🧹 Cleaning build artifacts..."
rm -rf node_modules
rm -rf android/build
rm -rf android/app/build
rm -rf android/.gradle
find . -name "*.apk" -type f -delete

# Ensure package-lock.json exists
echo "📦 Generating package-lock.json..."
npm install --package-lock-only

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << 'EOL'
# OSX
.DS_Store

# Android/IntelliJ
build/
.idea
.gradle
local.properties
*.iml
*.hprof

# Node
node_modules/
npm-debug.log
yarn-error.log

# React Native
android/app/build/
*.apk

# Bundle artifacts
*.jsbundle

# Temporary files
.expo/
.vscode/
EOL
fi

# Initialize git if not already
if [ ! -d .git ]; then
    echo "🎯 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit for CrystalAndroid"
fi

echo "✅ Project is ready for cloud build!"
echo ""
echo "Next steps:"
echo "1. Create a GitHub repository"
echo "2. Run: git remote add origin YOUR_GITHUB_URL"
echo "3. Run: git push -u origin main"
echo "4. Your APK will be built automatically!"
echo ""
echo "Or use Expo EAS Build:"
echo "1. Run: npm install -g eas-cli"
echo "2. Run: eas login"
echo "3. Run: eas build --platform android --profile preview"