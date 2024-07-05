import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { BookmarksProvider } from './src/context/BookmarksContext';
import { UserPreferencesProvider, useUserPreferences } from './src/context/UserPreferencesContext';

const AppContent = () => {
  const { nightMode } = useUserPreferences();

  return (
    <NavigationContainer theme={nightMode ? DarkTheme : DefaultTheme}>
      <StatusBar barStyle={nightMode ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>
        <AppNavigator />
      </SafeAreaView>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <UserPreferencesProvider>
      <BookmarksProvider>
        <AppContent />
      </BookmarksProvider>
    </UserPreferencesProvider>
  );
};

export default App;