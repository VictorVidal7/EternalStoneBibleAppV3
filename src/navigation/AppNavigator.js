import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { CardStyleInterpolators } from '@react-navigation/stack';
import CustomIconButton from '../components/CustomIconButton';
import { useTheme } from '@react-navigation/native';

// Importa todas las pantallas necesarias
import HomeScreen from '../screens/HomeScreen';
import BibleListScreen from '../screens/BibleListScreen';
import ChapterScreen from '../screens/ChapterScreen';
import VerseScreen from '../screens/VerseScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BibleStack = () => (
  <Stack.Navigator
    screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      gestureEnabled: true,
      gestureDirection: 'horizontal',
    }}
  >
    <Stack.Screen name="BibleList" component={BibleListScreen} options={{ title: 'Libros' }} />
    <Stack.Screen name="Chapter" component={ChapterScreen} options={({ route }) => ({ title: route.params.book })} />
    <Stack.Screen name="Verse" component={VerseScreen} options={({ route }) => ({ title: `${route.params.book} ${route.params.chapter}` })} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Inicio') iconName = 'home';
          else if (route.name === 'Biblia') iconName = 'book';
          else if (route.name === 'Favoritos') iconName = 'bookmark';
          else if (route.name === 'Buscar') iconName = 'search';
          else if (route.name === 'Ajustes') iconName = 'settings';
          
          return (
            <View pointerEvents="none">
              <CustomIconButton 
                name={iconName}
                size={size}
                color={focused ? colors.primary : color}
                style={{ 
                  margin: 0, 
                  backgroundColor: 'transparent',
                  elevation: 0,
                  shadowOpacity: 0,
                }}
                disabled={true}
              />
            </View>
          );
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Biblia" component={BibleStack} options={{ headerShown: false }} />
      <Tab.Screen name="Favoritos" component={BookmarksScreen} />
      <Tab.Screen name="Buscar" component={SearchScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;