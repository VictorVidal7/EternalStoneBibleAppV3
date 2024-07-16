import React, { lazy, Suspense } from 'react';
import { ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = lazy(() => import('../screens/HomeScreen'));
const BibleListScreen = lazy(() => import('../screens/BibleListScreen'));
const ChapterScreen = lazy(() => import('../screens/ChapterScreen'));
const VerseScreen = lazy(() => import('../screens/VerseScreen'));
const BookmarksScreen = lazy(() => import('../screens/BookmarksScreen'));
const ReadingPlanScreen = lazy(() => import('../screens/ReadingPlanScreen'));
const SearchScreen = lazy(() => import('../screens/SearchScreen'));
const SettingsScreen = lazy(() => import('../screens/SettingsScreen'));

const Stack = createStackNavigator();

const LoadingScreen = () => {
  const { colors } = useTheme();
  return (
    <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
  );
};

const AppNavigator = () => {
  const { colors, isDarkMode } = useTheme();

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
      {Object.entries({
        Home: HomeScreen,
        BibleList: BibleListScreen,
        Chapter: ChapterScreen,
        Verse: VerseScreen,
        Bookmarks: BookmarksScreen,
        ReadingPlan: ReadingPlanScreen,
        Search: SearchScreen,
        Settings: SettingsScreen,
      }).map(([name, Component]) => (
        <Stack.Screen 
          key={name}
          name={name} 
          options={{ title: name }}
        >
          {(props) => (
            <Suspense fallback={<LoadingScreen />}>
              <Component {...props} />
            </Suspense>
          )}
        </Stack.Screen>
      ))}
    </Stack.Navigator>
  );
};

export default React.memo(AppNavigator);