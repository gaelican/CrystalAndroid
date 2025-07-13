# CrystalAndroid Project Structure

## Overview
CrystalAndroid is a React Native implementation of the Crystal desktop application, designed to bring AI-powered development assistance to mobile devices.

## Directory Structure

```
CrystalAndroid/
├── src/
│   ├── components/          # Reusable React Native components
│   │   └── SessionListItem.tsx
│   ├── screens/            # Main application screens
│   │   └── HomeScreen.tsx
│   ├── services/           # Business logic and native module interfaces
│   │   ├── DatabaseService.ts
│   │   ├── GitService.ts
│   │   └── TerminalService.ts
│   ├── stores/             # State management using Zustand
│   │   ├── projectStore.ts
│   │   └── sessionStore.ts
│   ├── types/              # TypeScript type definitions
│   │   ├── config.ts
│   │   ├── index.ts
│   │   ├── project.ts
│   │   └── session.ts
│   └── utils/              # Utility functions
│       └── formatters.ts
├── android/
│   └── app/
│       └── src/
│           └── main/
│               └── java/
│                   └── com/
│                       └── crystalandroid/
│                           └── modules/    # Native Android modules
│                               ├── CrystalAndroidPackage.java
│                               ├── GitModule.java
│                               └── TerminalModule.java
├── docs/
│   └── TERMINAL_EMULATOR_RESEARCH.md
├── package.json            # Updated with necessary dependencies
└── PROJECT_STRUCTURE.md    # This file
```

## Key Components

### TypeScript Types
- Copied from Crystal desktop project
- Extended with mobile-specific interfaces
- Includes configuration, project, and session types

### State Management
- Using Zustand for state management
- Separate stores for projects and sessions
- Similar architecture to desktop version

### Services
- **DatabaseService**: SQLite integration for local storage
- **GitService**: Native module interface for git operations
- **TerminalService**: Terminal emulation and command execution

### Native Modules
- **GitModule**: Java implementation for git commands
- **TerminalModule**: Process execution and terminal sessions
- **CrystalAndroidPackage**: Module registration

## Dependencies Added

### Core Navigation
- @react-navigation/native
- @react-navigation/bottom-tabs
- @react-navigation/stack
- react-native-screens
- react-native-safe-area-context
- react-native-gesture-handler

### UI Components
- react-native-elements
- react-native-vector-icons

### Data Management
- zustand (state management)
- react-native-sqlite-storage (local database)

### File System & Git
- react-native-fs
- react-native-git-mobile (placeholder - needs implementation)

## Next Steps

1. **Navigation Setup**: Implement navigation structure
2. **Database Schema**: Complete SQLite schema implementation
3. **UI Components**: Build remaining screens and components
4. **Native Module Testing**: Test and refine native modules
5. **Terminal UI**: Implement terminal emulator interface
6. **Authentication**: Add API key management
7. **Sync Service**: Implement data synchronization
8. **Testing**: Add unit and integration tests

## Development Notes

- The project is set up for React Native 0.80.1
- Native modules require rebuilding the Android app
- Terminal emulation will use a hybrid approach (see docs)
- Git operations depend on git being available in the environment