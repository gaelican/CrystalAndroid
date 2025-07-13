#!/bin/bash

# Android Development Setup Script for Ubuntu in Termux
# This script installs all required tools for building React Native Android apps

set -e

echo "================================================"
echo "Android Development Setup for Ubuntu in Termux"
echo "================================================"

# Update system packages
echo "1. Updating system packages..."
apt update
apt upgrade -y

# Install basic development tools
echo "2. Installing basic development tools..."
apt install -y \
    curl \
    wget \
    git \
    unzip \
    zip \
    vim \
    build-essential \
    software-properties-common

# Install Java 17 (required for React Native)
echo "3. Installing Java 17..."
apt install -y openjdk-17-jdk openjdk-17-jre

# Set JAVA_HOME
echo "4. Setting up Java environment..."
echo "export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64" >> ~/.bashrc
echo "export PATH=\$JAVA_HOME/bin:\$PATH" >> ~/.bashrc
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64
export PATH=$JAVA_HOME/bin:$PATH

# Verify Java installation
java -version

# Install Node.js and npm (required for React Native)
echo "5. Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify Node installation
node --version
npm --version

# Create Android SDK directory
echo "6. Setting up Android SDK..."
mkdir -p ~/android-sdk
cd ~/android-sdk

# Download Android command-line tools
echo "7. Downloading Android command-line tools..."
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip commandlinetools-linux-11076708_latest.zip
mkdir -p cmdline-tools/latest
mv cmdline-tools/* cmdline-tools/latest/ 2>/dev/null || true
rm commandlinetools-linux-11076708_latest.zip

# Set Android environment variables
echo "8. Setting up Android environment..."
echo "export ANDROID_HOME=~/android-sdk" >> ~/.bashrc
echo "export ANDROID_SDK_ROOT=~/android-sdk" >> ~/.bashrc
echo "export PATH=\$ANDROID_HOME/cmdline-tools/latest/bin:\$PATH" >> ~/.bashrc
echo "export PATH=\$ANDROID_HOME/platform-tools:\$PATH" >> ~/.bashrc
echo "export PATH=\$ANDROID_HOME/build-tools/35.0.0:\$PATH" >> ~/.bashrc

export ANDROID_HOME=~/android-sdk
export ANDROID_SDK_ROOT=~/android-sdk
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$PATH

# Accept Android licenses
echo "9. Accepting Android SDK licenses..."
yes | sdkmanager --licenses || true

# Install Android SDK components
echo "10. Installing Android SDK components..."
sdkmanager "platform-tools"
sdkmanager "platforms;android-35"
sdkmanager "build-tools;35.0.0"
sdkmanager "ndk;27.1.12297006"

# Install Gradle
echo "11. Installing Gradle..."
cd ~
wget https://services.gradle.org/distributions/gradle-8.11.1-bin.zip
unzip gradle-8.11.1-bin.zip
rm gradle-8.11.1-bin.zip
echo "export PATH=~/gradle-8.11.1/bin:\$PATH" >> ~/.bashrc
export PATH=~/gradle-8.11.1/bin:$PATH

# Verify Gradle installation
gradle --version

# Install additional tools for React Native
echo "12. Installing React Native CLI..."
npm install -g react-native-cli

# Final setup
echo "13. Final configuration..."
source ~/.bashrc

echo ""
echo "================================================"
echo "Setup Complete!"
echo "================================================"
echo ""
echo "Environment Variables Set:"
echo "JAVA_HOME=$JAVA_HOME"
echo "ANDROID_HOME=$ANDROID_HOME"
echo ""
echo "Installed versions:"
java -version 2>&1 | head -n 1
node --version
npm --version
gradle --version | grep "Gradle"
echo ""
echo "To build the React Native project:"
echo "1. Exit and re-login to Ubuntu to ensure all environment variables are loaded"
echo "2. Navigate to your project directory"
echo "3. Run: cd android && ./gradlew assembleDebug"
echo ""