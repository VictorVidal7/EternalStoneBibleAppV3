import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import HomeScreen from '../screens/HomeScreen';
import BibleListScreen from '../screens/BibleListScreen';
import ChapterScreen from '../screens/ChapterScreen';
import VerseScreen from '../screens/VerseScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import ReadingPlanScreen from '../screens/ReadingPlanScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { colors, isDarkMode } = useTheme();

  console.log('AppNavigator rendering with isDarkMode:', isDarkMode);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Inicio' }} 
      />
      <Stack.Screen 
        name="BibleList" 
        component={BibleListScreen} 
        options={{ title: 'Libros de la Biblia' }} 
      />
      <Stack.Screen 
        name="Chapter" 
        component={ChapterScreen} 
        options={{ title: 'Capítulo' }} 
      />
      <Stack.Screen 
        name="Verse" 
        component={VerseScreen} 
        options={{ title: 'Versículo' }} 
      />
      <Stack.Screen 
        name="Bookmarks" 
        component={BookmarksScreen} 
        options={{ title: 'Marcadores' }} 
      />
      <Stack.Screen 
        name="ReadingPlan" 
        component={ReadingPlanScreen} 
        options={{ title: 'Plan de Lectura' }} 
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ title: 'Búsqueda' }} 
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Configuración' }} 
      />
    </Stack.Navigator>
  );
};

export default React.memo(AppNavigator);