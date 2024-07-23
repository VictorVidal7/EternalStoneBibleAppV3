import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Importa todas las pantallas necesarias
import HomeScreen from '../screens/HomeScreen';
import BibleListScreen from '../screens/BibleListScreen';
import ChapterScreen from '../screens/ChapterScreen';
import VerseScreen from '../screens/VerseScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ReadingPlanScreen from '../screens/ReadingPlanScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Navegador de pila para la sección de la Biblia
const BibleStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="BibleList" 
      component={BibleListScreen} 
      options={{ title: 'Libros' }}
    />
    <Stack.Screen 
      name="Chapter" 
      component={ChapterScreen} 
      options={({ route }) => ({ title: `${route.params.book} - Capítulos` })}
    />
    <Stack.Screen 
      name="Verse" 
      component={VerseScreen} 
      options={({ route }) => ({ title: `${route.params.book} ${route.params.chapter}` })}
    />
  </Stack.Navigator>
);

// Navegador de pila para la pantalla de inicio
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="HomeScreen" 
      component={HomeScreen} 
      options={{ title: 'Inicio' }}
    />
    <Stack.Screen 
      name="ReadingPlan" 
      component={ReadingPlanScreen} 
      options={{ title: 'Plan de Lectura' }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = 'home';
          } else if (route.name === 'Biblia') {
            iconName = 'book';
          } else if (route.name === 'Favoritos') {
            iconName = 'bookmark';
          } else if (route.name === 'Buscar') {
            iconName = 'search';
          } else if (route.name === 'Ajustes') {
            iconName = 'settings';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Inicio" 
        component={HomeStack} 
        options={{ 
          headerShown: false,
          title: 'Inicio'
        }}
      />
      <Tab.Screen 
        name="Biblia" 
        component={BibleStack} 
        options={{ 
          headerShown: false,
          title: 'Biblia'
        }}
      />
      <Tab.Screen 
        name="Favoritos" 
        component={BookmarksScreen} 
        options={{ title: 'Favoritos' }}
      />
      <Tab.Screen 
        name="Buscar" 
        component={SearchScreen} 
        options={{ title: 'Buscar' }}
      />
      <Tab.Screen 
        name="Ajustes" 
        component={SettingsScreen} 
        options={{ title: 'Ajustes' }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;