# GitHub Actions Build Research: React Native 0.80 SQLite Issues

## Current Issue

Our React Native 0.80.1 project fails to build in GitHub Actions with the error:
```
No matching variant of project :react-native-sqlite-storage was found
```

The error occurs because:
- Android Gradle Plugin 8.9.2 requires specific variant configurations
- react-native-sqlite-storage (v6.0.1) hasn't been updated for modern React Native
- The library lacks proper Gradle variant configuration for AGP 8.9.2

## Research Findings

### 1. React Native 0.80 Breaking Changes

From official sources and community reports:
- React Native 0.80 includes React 19.1.0
- Kotlin version bumped to 2.1.20
- Several Java classes migrated to Kotlin
- StandardCharsets class deleted (use java.nio.charset.StandardCharsets)
- More strict variant resolution in Gradle

### 2. Common Android Build Issues in RN 0.80

Stack Overflow reports widespread issues:
- "package does not exist" errors for native libraries
- Root cause often JDK version (must use JDK 17, not 24)
- Gradle variant resolution more strict
- Native libraries need updates for Kotlin 2.1.20

### 3. SQLite Library Status

#### react-native-sqlite-storage (Original)
- Last major update supports React 16.2
- Version 3.2 compatible with RN 0.40
- Not maintained for modern React Native
- No Gradle variant configuration for AGP 8.x

#### @boltcode/react-native-sqlite-storage (Fork)
- Tested with React 18.2, React Native 0.72.0
- More actively maintained
- May work with RN 0.80 with modifications

#### op-sqlite (Modern Alternative)
- "Fastest SQLite library for react-native"
- 5x faster, 5x less memory than alternatives
- Actively maintained
- Supports React Native macOS
- Built-in key-value store
- Performance optimizations available

#### expo-sqlite
- Part of Expo ecosystem
- Supports SQLCipher encryption
- React.Suspense integration
- Works with Drizzle ORM
- Good for Expo projects

### 4. Community Solutions

No specific Reddit threads found about this exact issue, but general patterns emerge:
- Most developers avoid native SQLite in favor of alternatives
- Those using SQLite often switch to op-sqlite for RN 0.70+
- GitHub Actions builds more reliable than local Termux builds
- JDK version critical (must be 17)

## Recommended Solutions

### Option 1: Replace with op-sqlite (Recommended)

```bash
npm uninstall react-native-sqlite-storage
npm install @op-engineering/op-sqlite
```

Benefits:
- Actively maintained for modern React Native
- Better performance (5x faster)
- Lower memory usage
- No variant configuration issues

### Option 2: Try @boltcode Fork

```bash
npm uninstall react-native-sqlite-storage
npm install @boltcode/react-native-sqlite-storage
```

Benefits:
- Drop-in replacement
- Tested with RN 0.72
- May work with minimal changes

### Option 3: Remove SQLite Dependency

If SQLite isn't critical:
- Use AsyncStorage for simple key-value
- Use MMKV for performance key-value
- Use filesystem for structured data

### Option 4: Fix Current Library (Not Recommended)

Would require:
- Updating library's build.gradle for AGP 8.9.2
- Adding proper variant configuration
- Fixing Kotlin compatibility
- Maintaining a fork

## Implementation Plan

1. **Immediate Fix**: Replace react-native-sqlite-storage with op-sqlite
2. **Update Code**: Migrate SQLite calls to op-sqlite API
3. **Test Locally**: Ensure functionality works
4. **Push to GitHub**: Trigger new Actions build
5. **Monitor**: Verify build succeeds

## Additional Recommendations

1. **Ensure JDK 17**: Add to workflow file:
   ```yaml
   - uses: actions/setup-java@v4
     with:
       java-version: '17'
   ```

2. **Clean Builds**: Add clean steps:
   ```yaml
   - name: Clean Gradle
     run: cd android && ./gradlew clean
   ```

3. **Cache Management**: Clear caches if issues persist

## Conclusion

The react-native-sqlite-storage library is incompatible with React Native 0.80's build system. The most reliable solution is to migrate to op-sqlite, which is actively maintained and designed for modern React Native.

## Update: op-sqlite Also Has Issues

After implementing op-sqlite, we encountered Kotlin compilation errors. Research shows:
- React Native 0.80 has widespread issues with native modules
- Many libraries face "package does not exist" errors
- Kotlin compilation failures are common due to RN 0.80 changes

## Alternative Approach

Given the persistent issues with SQLite libraries in React Native 0.80, consider:
1. Using AsyncStorage for simple key-value storage
2. Using the filesystem with react-native-fs (already installed)
3. Downgrading to React Native 0.79.x where SQLite libraries work
4. Waiting for library updates that fully support RN 0.80