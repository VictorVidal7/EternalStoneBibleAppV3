import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserPreferencesProvider } from './src/context/UserPreferencesContext';
import { ReadingProgressProvider } from './src/context/ReadingProgressContext';
import { BookmarksProvider } from './src/context/BookmarksContext';
import { ReadingPlanProvider } from './src/context/ReadingPlanContext';
import { NotesProvider } from './src/context/NotesContext';
import AppNavigator from './src/navigation/AppNavigator';
import './src/i18n';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Something went wrong.</Text>
          <Text>{this.state.error.toString()}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
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
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App;