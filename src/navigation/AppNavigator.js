import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import BibleListScreen from '../screens/BibleListScreen';
import ChapterScreen from '../screens/ChapterScreen';
import VerseScreen from '../screens/VerseScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
        <Stack.Screen name="Bible" component={BibleListScreen} options={{ title: 'Libros de la Biblia' }} />
        <Stack.Screen name="Chapter" component={ChapterScreen} options={{ title: 'Capítulos' }} />
        <Stack.Screen name="Verse" component={VerseScreen} options={{ title: 'Versículos' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;