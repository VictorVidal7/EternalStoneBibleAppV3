import React, { useState, useEffect } from 'react';
import { View, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { UserPreferencesProvider } from './src/context/UserPreferencesContext';
import { BookmarksProvider } from './src/context/BookmarksContext';
import { ReadingPlanProvider } from './src/context/ReadingPlanContext';
import { ErrorProvider } from './src/context/ErrorContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorDisplay from './src/components/ErrorDisplay';
import NotificationService from './src/services/NotificationService';
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

  useEffect(() => {
    const setupNotifications = async () => {
      if (Platform.OS === 'android') {
        try {
          await NotificationService.requestPermissions();
        } catch (error) {
          console.error('Error setting up notifications:', error);
          // No mostramos el error al usuario aquí, ya que puede ser normal en algunas versiones de Android
        }
      }
    };

    setupNotifications();
  }, []);

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