import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import BibleListScreen from '../screens/BibleListScreen';
import ChapterScreen from '../screens/ChapterScreen';
import VerseScreen from '../screens/VerseScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import ReadingPlanScreen from '../screens/ReadingPlanScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SearchScreen from '../screens/SearchScreen';  // Asegúrate de que este archivo exista

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
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