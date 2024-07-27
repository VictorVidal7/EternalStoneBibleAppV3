import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import { UserPreferencesProvider } from './src/context/UserPreferencesContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { ReadingProgressProvider } from './src/context/ReadingProgressContext';
import { BookmarksProvider } from './src/context/BookmarksContext';
import { ReadingPlanProvider } from './src/context/ReadingPlanContext';
import { NotesProvider } from './src/context/NotesContext'; // Corregido aquí
import { resetDatabase, initializeBibleData, closeBibleDatabase, preloadFrequentlyAccessedData } from './src/services/bibleDataManager';
import InteractiveTutorial from './src/components/InteractiveTutorial';
import './src/i18n';

const AppNavigator = React.lazy(() => import('./src/navigation/AppNavigator'));

const AppContent = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    checkTutorialStatus();
  }, []);

  const checkTutorialStatus = async () => {
    try {
      const tutorialCompleted = await AsyncStorage.getItem('tutorialCompleted');
      if (tutorialCompleted !== 'true') {
        setShowTutorial(true);
      }
    } catch (error) {
      console.error('Error checking tutorial status:', error);
    }
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };

  if (showTutorial) {
    return <InteractiveTutorial onComplete={handleTutorialComplete} />;
  }

  return (
    <ReadingProgressProvider>
      <BookmarksProvider>
        <ReadingPlanProvider>
          <NotesProvider>
            <NavigationContainer theme={theme}>
              <React.Suspense fallback={<LoadingScreen message="Cargando..." />}>
                <AppNavigator />
              </React.Suspense>
            </NavigationContainer>
          </NotesProvider>
        </ReadingPlanProvider>
      </BookmarksProvider>
    </ReadingProgressProvider>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState(null);

  const initApp = useCallback(async () => {
    try {
      await analytics().setAnalyticsCollectionEnabled(true);
      await analytics().logAppOpen();
      
      await resetDatabase();
      await initializeBibleData();
      await preloadFrequentlyAccessedData();
      
      console.log('App initialized');
    } catch (error) {
      console.error('Error initializing app:', error);
      setInitError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initApp();

    return () => {
      closeBibleDatabase().catch(console.error);
    };
  }, [initApp]);

  if (isLoading) {
    return <LoadingScreen message="Cargando Eternal Stone Bible App..." />;
  }

  if (initError) {
    return <ErrorScreen message={initError} />;
  }

  return (
    <SafeAreaProvider>
      <UserPreferencesProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </UserPreferencesProvider>
    </SafeAreaProvider>
  );
};

const LoadingScreen = ({ message }) => (
  <View style={styles.centerContainer}>
    <ActivityIndicator size="large" color="#0000ff" />
    <Text style={styles.loadingText}>{message}</Text>
  </View>
);

const ErrorScreen = ({ message }) => (
  <View style={styles.centerContainer}>
    <Text style={styles.errorTitle}>Se produjo un error al inicializar la aplicación:</Text>
    <Text style={styles.errorMessage}>{message}</Text>
    <Text style={styles.errorInstructions}>
      Por favor, reinicie la aplicación. Si el problema persiste, contacte con soporte.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorInstructions: {
    marginTop: 20,
    textAlign: 'center',
  },
});

export default App;