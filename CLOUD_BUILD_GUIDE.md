# Cloud Build Guide for CrystalAndroid

Since you're on Android and can't build locally, here are several cloud services you can use to build your APK:

## Option 1: GitHub Actions (Recommended - Free)

### Steps:
1. Create a GitHub repository
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/CrystalAndroid.git
   git push -u origin main
   ```

3. The workflow will automatically trigger and build your APK
4. Download the APK from:
   - Go to Actions tab in your repository
   - Click on the latest workflow run
   - Download the artifacts (app-debug or app-release)

### Features:
- ✅ Completely free for public repositories
- ✅ Automatic builds on every push
- ✅ Creates releases automatically
- ✅ Both debug and release APKs

## Option 2: Expo EAS Build (Easiest)

### Steps:
1. Install EAS CLI on your Android device:
   ```bash
   npm install -g eas-cli
   ```

2. Create an Expo account at https://expo.dev

3. Login and configure:
   ```bash
   eas login
   eas build:configure
   ```

4. Build the APK:
   ```bash
   # For development build
   eas build --platform android --profile development

   # For production build
   eas build --platform android --profile production
   ```

5. Download the APK from the link provided after build completes

### Features:
- ✅ No Git required
- ✅ Works directly from your Android device
- ✅ Free tier available (30 builds/month)
- ✅ Handles signing automatically

## Option 3: Appcircle (Alternative)

### Steps:
1. Sign up at https://appcircle.io (free tier available)
2. Create a new app and select "React Native"
3. Connect your GitHub repository
4. The `appcircle.yml` file will be detected automatically
5. Start a build and download the APK

### Features:
- ✅ User-friendly interface
- ✅ Free tier with 25 builds/month
- ✅ No credit card required

## Option 4: Codemagic

### Steps:
1. Sign up at https://codemagic.io
2. Connect your repository
3. Select "React Native App"
4. Configure build settings (or use defaults)
5. Start build and download APK

### Features:
- ✅ 500 free build minutes/month
- ✅ Easy setup
- ✅ Good for beginners

## Quick Option: Using Online Services (No Git Required)

If you don't want to use Git, you can use:

### 1. Appetize.io Upload Service
- Zip your project folder
- Upload to a file sharing service
- Use their build service

### 2. BuildBox
- Upload your source code directly
- Get APK without Git

## Preparing Your Code for Cloud Build

Before uploading, ensure:

1. **Remove node_modules**:
   ```bash
   rm -rf node_modules
   ```

2. **Create .gitignore** (if using Git):
   ```bash
   echo "node_modules/
   android/build/
   android/app/build/
   .gradle/
   *.apk" > .gitignore
   ```

3. **Ensure package-lock.json exists**:
   ```bash
   npm install
   ```

## Testing the APK on Your Device

Once you have the APK:

1. Download to your Android device
2. Enable "Install from Unknown Sources" in Settings
3. Open the APK file to install
4. Grant necessary permissions when prompted

## Troubleshooting

### If build fails:
1. Check Java version compatibility (needs JDK 17)
2. Ensure all dependencies in package.json are correct
3. Check if native modules are properly linked

### Common Issues:
- **Out of memory**: Use smaller cloud build machines
- **Gradle errors**: Clear gradle cache in workflow
- **Missing dependencies**: Ensure package-lock.json is committed

## Recommended Approach for Android Users

1. **Use GitHub + GitHub Actions** for completely free builds
2. **Use Expo EAS** if you want the simplest setup
3. **Use Appcircle** for a nice UI and easy configuration

All these services will email you or provide a download link once the build is complete!