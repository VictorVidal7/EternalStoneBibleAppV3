import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { UserPreferencesProvider } from './src/context/UserPreferencesContext';
import { BookmarksProvider } from './src/context/BookmarksContext';
import { ReadingPlanProvider } from './src/context/ReadingPlanContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <UserPreferencesProvider>
      <BookmarksProvider>
        <ReadingPlanProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </ReadingPlanProvider>
      </BookmarksProvider>
    </UserPreferencesProvider>
  );
};

export default App;