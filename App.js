import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { UserPreferencesProvider } from './src/context/UserPreferencesContext';
import { BookmarksProvider } from './src/context/BookmarksContext';
import { ReadingPlanProvider } from './src/context/ReadingPlanContext';
import { ErrorProvider } from './src/context/ErrorContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorDisplay from './src/components/ErrorDisplay';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error caught by ErrorBoundary:', error, errorInfo);
    this.props.showError('Se ha producido un error inesperado.');
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Oops! Something went wrong.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  const [error, setError] = useState(null);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000); // Auto-dismiss after 5 seconds
  };

  return (
    <ErrorProvider value={{ error, showError }}>
      <ErrorBoundary showError={showError}>
        <UserPreferencesProvider>
          <BookmarksProvider>
            <ReadingPlanProvider>
              <NavigationContainer>
                <AppNavigator />
                <ErrorDisplay />
              </NavigationContainer>
            </ReadingPlanProvider>
          </BookmarksProvider>
        </UserPreferencesProvider>
      </ErrorBoundary>
    </ErrorProvider>
  );
};

export default App;