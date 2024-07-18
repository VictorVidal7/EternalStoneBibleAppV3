import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import analytics from '@react-native-firebase/analytics';
import { UserPreferencesProvider } from './src/context/UserPreferencesContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { ReadingProgressProvider } from './src/context/ReadingProgressContext';
import { BookmarksProvider } from './src/context/BookmarksContext';
import { ReadingPlanProvider } from './src/context/ReadingPlanContext';
import { NotesProvider } from './src/context/NotesContext';
import { resetDatabase, initializeBibleData, closeBibleDatabase, preloadFrequentlyAccessedData } from './src/services/bibleDataManager';
import './src/i18n';

const AppNavigator = React.lazy(() => import('./src/navigation/AppNavigator'));

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    const initApp = async () => {
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
    };

    initApp();

    return () => {
      closeBibleDatabase().catch(console.error);
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando Eternal Stone Bible App...</Text>
      </View>
    );
  }

  if (initError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
          Se produjo un error al inicializar la aplicación:
        </Text>
        <Text style={{ color: 'red', textAlign: 'center' }}>{initError}</Text>
        <Text style={{ marginTop: 20, textAlign: 'center' }}>
          Por favor, reinicie la aplicación. Si el problema persiste, contacte con soporte.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <UserPreferencesProvider>
        <ThemeProvider>
          <ReadingProgressProvider>
            <BookmarksProvider>
              <ReadingPlanProvider>
                <NotesProvider>
                  <NavigationContainer>
                    <React.Suspense fallback={
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text>Cargando...</Text>
                      </View>
                    }>
                      <AppNavigator />
                    </React.Suspense>
                  </NavigationContainer>
                </NotesProvider>
              </ReadingPlanProvider>
            </BookmarksProvider>
          </ReadingProgressProvider>
        </ThemeProvider>
      </UserPreferencesProvider>
    </SafeAreaProvider>
  );
};

export default App;