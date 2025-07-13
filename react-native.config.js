module.exports = {
  dependencies: {
    'react-native-sqlite-storage': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-sqlite-storage/src/android/src',
          packageImportPath: 'import io.squite.SQLitePluginPackage;',
        },
        ios: {
          podspecPath: '../node_modules/react-native-sqlite-storage/react-native-sqlite-storage.podspec',
        },
      },
    },
  },
};