import React, { useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import ListItem from '../components/ListItem';
import DailyVerse from '../components/DailyVerse';
import { useTranslation } from 'react-i18next';
import { AnalyticsService } from '../services/AnalyticsService';

const HomeScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { t } = useTranslation();

  console.log('Theme in HomeScreen:', theme); // Depuración

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.primary,
      padding: 20,
      alignItems: 'center',
      borderBottomLeftRadius: theme.roundness,
      borderBottomRightRadius: theme.roundness,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.isDarkMode ? theme.colors.background : theme.colors.card,
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: theme.isDarkMode ? theme.colors.background : theme.colors.card,
      opacity: 0.8,
    },
    menuContainer: {
      marginTop: 20,
      borderRadius: theme.roundness,
      overflow: 'hidden',
      marginHorizontal: 16,
      backgroundColor: theme.colors.card,
    },
  });

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const menuItems = [
    { title: t('exploreBible'), icon: 'menu-book', screen: 'Bible' },
    { title: t('myBookmarks'), icon: 'bookmark', screen: 'Bookmarks' },
    { title: t('readingPlan'), icon: 'event-note', screen: 'ReadingPlan' },
    { title: t('search'), icon: 'search', screen: 'Search' },
    { title: t('settings'), icon: 'settings', screen: 'Settings' },
  ];

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
    AnalyticsService.logEvent(`navigate_to_${screen.toLowerCase()}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.headerTitle}>{t('appName')}</Text>
        <Text style={styles.headerSubtitle}>{t('dailyInspiration')}</Text>
      </Animated.View>
      
      <Animated.View style={{ opacity: fadeAnim }}>
        <DailyVerse />
      </Animated.View>
      
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <Animated.View key={index} style={{ 
            opacity: fadeAnim, 
            transform: [{ 
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              }) 
            }] 
          }}>
            <ListItem
              title={item.title}
              iconName={item.icon}
              onPress={() => handleNavigation(item.screen)}
              theme={theme}
            />
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;