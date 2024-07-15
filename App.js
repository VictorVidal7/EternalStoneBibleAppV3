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
import { resetDatabase, initializeBibleData, closeBibleDatabase } from './src/services/bibleDataManager';

const App = () => {
  useEffect(() => {
    const initApp = async () => {
      await analytics().setAnalyticsCollectionEnabled(true);
      await analytics().logAppOpen();
      
      // Reset and reinitialize the database
      await resetDatabase();
      await initializeBibleData();
      
      console.log('App initialized');
    };

    initApp().catch(console.error);

    return () => {
      closeBibleDatabase().catch(console.error);
    };
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