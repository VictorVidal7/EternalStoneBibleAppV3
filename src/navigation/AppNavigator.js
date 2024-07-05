import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import BibleListScreen from '../screens/BibleListScreen';
import ChapterScreen from '../screens/ChapterScreen';
import VerseScreen from '../screens/VerseScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useUserPreferences } from '../context/UserPreferencesContext';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { colors } = useTheme();
  const { fontFamily, fontSize } = useUserPreferences();

  const getFontSize = () => {
    switch (fontSize) {
      case 'small': return 16;
      case 'medium': return 18;
      case 'large': return 20;
      default: return 18;
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily,
          fontSize: getFontSize(),
        },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Stack.Screen name="Bible" component={BibleListScreen} options={{ title: 'Libros de la Biblia' }} />
      <Stack.Screen name="Chapter" component={ChapterScreen} options={{ title: 'Capítulos' }} />
      <Stack.Screen name="Verse" component={VerseScreen} options={{ title: 'Versículos' }} />
      <Stack.Screen name="Bookmarks" component={BookmarksScreen} options={{ title: 'Mis Marcadores' }} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Buscar' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configuración' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;