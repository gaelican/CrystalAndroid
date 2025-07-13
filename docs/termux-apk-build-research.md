# Research: Building APKs in Termux - Community Experiences

## Overview

Building Android APKs (especially React Native apps) in Termux faces a fundamental challenge: Gradle downloads x86_64 binaries that don't work on ARM64 Android devices. This research compiles community solutions and experiences.

## The Core Problem

1. **Architecture Mismatch**: Android SDK tools (particularly AAPT2) are built for x86_64, but Android devices run on ARM64
2. **Gradle Auto-Download**: Gradle automatically downloads incompatible binaries, overriding system-installed versions
3. **React Native Complexity**: React Native builds require multiple tools working together, multiplying potential failure points

## Community Solutions

### 1. AAPT2 Override Method (Most Common)

The most frequently successful approach:

```bash
# Install Termux AAPT2
apt install aapt2

# Add to android/gradle.properties
android.aapt2FromMavenOverride=/data/data/com.termux/files/usr/bin/aapt2
```

**Success Rate**: Mixed - works for some simple projects but often fails with React Native

### 2. Ubuntu in Termux (PRoot Method)

Many developers report success with this approach:

```bash
# Install Ubuntu in Termux
apt install git wget proot
git clone https://github.com/MFDGaming/ubuntu-in-termux.git
cd ubuntu-in-termux
bash ubuntu.sh -y

# Inside Ubuntu, install full Android development environment
apt install default-jdk-headless openjdk-17-jdk-headless
# Download and configure Android SDK
```

**Success Rate**: Higher success rate, but performance overhead

### 3. Community ARM64 Tools

Developers like Lzhiyong have built ARM64 versions of Android SDK tools:

- **Repository**: https://github.com/lzhiyong/android-sdk-tools
- **Includes**: aapt, aapt2, aidl, zipalign, adb, fastboot
- **Status**: Possibly unmaintained, but tools still work

### 4. Alternative Build Methods

Some developers bypass Gradle entirely:

- **BuildAPKs Project**: Scripts that use aapt, dx, ecj directly
- **Manual Build**: Using command-line tools without Gradle
- **Repository**: https://github.com/BuildAPKs/buildAPKs

## React Native Specific Issues

### Reported Problems

1. **CMake Failures**: React Native Reanimated library often fails
2. **Native Dependencies**: Libraries with native code face additional hurdles
3. **Version Compatibility**: Newer React Native versions (0.70+) have more issues

### Working Configurations

- Some success with React Native 0.60-0.65
- Better results with projects without native dependencies
- Expo-based projects sometimes work better

## Architecture-Specific Solutions

### For API 35 Issues (December 2024)

Recent reports show failures with targetSdk/compileSdk 35:
- Missing android.jar files
- AAPT2 compatibility issues
- No confirmed solution yet

### JAR File Replacement Method

For persistent issues:

```bash
# Find AAPT2 JAR files in Gradle cache
find ~/.gradle -name "aapt2-*-linux.jar"

# Replace x86 binary with ARM64 version
jar -u -f aapt2-*-linux.jar -C /usr/bin aapt2
```

## Alternative Development Approaches

### 1. GitHub Actions (Recommended)

Since Termux builds face so many issues, using CI/CD is often more reliable:
- Build on GitHub Actions with proper x86_64 environment
- Download APK to device for testing
- Avoid architecture issues entirely

### 2. Cloud Development

- Use cloud IDEs with ARM64 support
- Remote development on x86_64 servers
- Web-based React Native development tools

### 3. Cross-Architecture Solutions

- UserLAnd app (alternative to Termux)
- Full Linux distributions on Android
- QEMU emulation (very slow)

## Success Stories

### What Works

1. **Simple Android Projects**: Basic Java/Kotlin apps often build successfully
2. **Non-Gradle Builds**: Direct use of Android tools works better
3. **Older SDK Versions**: SDK 28-30 have better ARM64 support

### What Doesn't Work Well

1. **Modern React Native**: Version 0.70+ with new architecture
2. **Complex Native Dependencies**: Libraries requiring compilation
3. **Latest Android Features**: API 33+ features often fail

## Recommendations for Our Project

Given our React Native 0.80.1 project with sqlite-storage dependency:

1. **Primary Approach**: Continue with GitHub Actions
   - Most reliable for modern React Native
   - Avoids all architecture issues
   - Already partially working

2. **Fallback Option**: Ubuntu in Termux
   - If local builds are essential
   - Expect performance issues
   - May still face some compatibility problems

3. **Alternative Storage**: Consider replacing sqlite-storage
   - Look for pure JavaScript alternatives
   - Or libraries with better ARM64 support
   - AsyncStorage might be sufficient

## Community Sentiment

The consensus is clear:
- Building modern Android apps in Termux is possible but challenging
- Architecture issues are fundamental and unlikely to be resolved soon
- Most developers recommend using proper development environments
- Those who succeed often spend days troubleshooting

## Future Outlook

- Official ARM64 support from Google is unlikely soon
- Community tools may become unmaintained
- Cloud-based development is becoming more viable
- Termux development focuses on terminal tools, not Android SDK

## Key Takeaways

1. **It's Possible But Difficult**: Success requires significant effort and workarounds
2. **Architecture is the Core Issue**: No perfect solution exists for x86_64 vs ARM64
3. **CI/CD is More Reliable**: GitHub Actions or similar services avoid these issues
4. **Community Tools Help**: But may be outdated or unmaintained
5. **Expectations Must Be Realistic**: Perfect compatibility is unlikely

## Resources

- Lzhiyong's SDK Tools: https://github.com/lzhiyong/android-sdk-tools
- BuildAPKs Project: https://github.com/BuildAPKs/buildAPKs
- TermuxArch: For better filesystem access
- Ubuntu in Termux: https://github.com/MFDGaming/ubuntu-in-termux