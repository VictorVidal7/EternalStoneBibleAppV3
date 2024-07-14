import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import { UserPreferencesProvider } from './src/context/UserPreferencesContext';
import { ReadingProgressProvider } from './src/context/ReadingProgressContext';
import { BookmarksProvider } from './src/context/BookmarksContext';
import { ReadingPlanProvider } from './src/context/ReadingPlanContext';
import { NotesProvider } from './src/context/NotesContext';
import AppNavigator from './src/navigation/AppNavigator';
import './src/i18n';
import analytics from '@react-native-firebase/analytics';

const App = () => {
  useEffect(() => {
    const initAnalytics = async () => {
      await analytics().setAnalyticsCollectionEnabled(true);
      await analytics().logAppOpen();
      console.log('Firebase Analytics initialized');
    };

    initAnalytics().catch(console.error);
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UserPreferencesProvider>
          <ReadingProgressProvider>
            <BookmarksProvider>
              <ReadingPlanProvider>
                <NotesProvider>
                  <NavigationContainer>
                    <AppNavigator />
                  </NavigationContainer>
                </NotesProvider>
              </ReadingPlanProvider>
            </BookmarksProvider>
          </ReadingProgressProvider>
        </UserPreferencesProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;