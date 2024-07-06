import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useUserPreferences } from '../context/UserPreferencesContext';
import HomeScreen from '../screens/HomeScreen';
import BibleListScreen from '../screens/BibleListScreen';
import ChapterScreen from '../screens/ChapterScreen';
import VerseScreen from '../screens/VerseScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import ReadingPlanScreen from '../screens/ReadingPlanScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { nightMode, fontSize, fontFamily } = useUserPreferences();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: nightMode ? '#121212' : '#f8f8f8',
        },
        headerTintColor: nightMode ? '#ffffff' : '#000000',
        headerTitleStyle: {
          fontFamily,
          fontSize: fontSize === 'small' ? 18 : fontSize === 'large' ? 22 : 20,
        },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Stack.Screen name="Bible" component={BibleListScreen} options={{ title: 'Libros de la Biblia' }} />
      <Stack.Screen name="Chapter" component={ChapterScreen} options={{ title: 'Capítulos' }} />
      <Stack.Screen name="Verse" component={VerseScreen} options={{ title: 'Versículos' }} />
      <Stack.Screen name="Bookmarks" component={BookmarksScreen} options={{ title: 'Mis Marcadores' }} />
      <Stack.Screen name="ReadingPlan" component={ReadingPlanScreen} options={{ title: 'Plan de Lectura' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configuración' }} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Buscar' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;