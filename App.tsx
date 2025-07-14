/**
 * CrystalAndroid - Android port of Crystal desktop app
 * 
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, useColorScheme, View, Text, ActivityIndicator } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { GitTestScreen } from './src/screens/GitTestScreen';
import { DatabaseTestScreen } from './src/screens/DatabaseTestScreen';
import { useDatabase } from './src/hooks/useDatabase';

const Stack = createStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const { isInitialized, error } = useDatabase();

  if (error) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red', fontSize: 16 }}>Database Error</Text>
          <Text style={{ color: '#666', marginTop: 10 }}>{error}</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  if (!isInitialized) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={{ marginTop: 10, color: '#666' }}>Initializing...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
            },
            headerTintColor: isDarkMode ? '#fff' : '#000',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Crystal Android' }}
          />
          <Stack.Screen 
            name="GitTest" 
            component={GitTestScreen}
            options={{ title: 'Git Test' }}
          />
          <Stack.Screen 
            name="DatabaseTest" 
            component={DatabaseTestScreen}
            options={{ title: 'Database Test' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;