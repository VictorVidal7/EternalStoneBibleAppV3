import React, { useEffect, useCallback } from 'react';
import { View, ScrollView, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DailyVerse from '../components/DailyVerse';
import { useTranslation } from 'react-i18next';
import { AnalyticsService } from '../services/AnalyticsService';

const HomeScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { t } = useTranslation();

  const fadeAnim = new Animated.Value(0);
  const translateY = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

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
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.background,
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 18,
      color: theme.colors.background,
      opacity: 0.8,
    },
    menuContainer: {
      marginTop: 20,
      borderRadius: theme.roundness,
      overflow: 'hidden',
      marginHorizontal: 16,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: 16,
      marginBottom: 8,
      borderRadius: theme.roundness,
      elevation: 3,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    menuItemText: {
      marginLeft: 16,
      fontSize: 18,
      color: theme.colors.text,
      flex: 1,
    },
  });

  const menuItems = [
    { title: t('exploreBible'), icon: 'menu-book', screen: 'Bible' },
    { title: t('myBookmarks'), icon: 'bookmark', screen: 'Bookmarks' },
    { title: t('readingPlan'), icon: 'event-note', screen: 'ReadingPlan' },
    { title: t('search'), icon: 'search', screen: 'Search' },
    { title: t('settings'), icon: 'settings', screen: 'Settings' },
  ];

  const handleNavigation = useCallback((screen) => {
    navigation.navigate(screen);
    AnalyticsService.logEvent(`navigate_to_${screen.toLowerCase()}`);
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.headerTitle}>{t('appName')}</Text>
        <Text style={styles.headerSubtitle}>{t('dailyInspiration')}</Text>
      </Animated.View>
      
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
        <DailyVerse />
      </Animated.View>
      
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <Animated.View key={index} style={{ 
            opacity: fadeAnim, 
            transform: [{ 
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50 + index * 10, 0]
              }) 
            }] 
          }}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigation(item.screen)}
              accessibilityLabel={item.title}
              accessibilityRole="button"
            >
              <Icon name={item.icon} size={24} color={theme.colors.primary} />
              <Text style={styles.menuItemText}>{item.title}</Text>
              <Icon name="chevron-right" size={24} color={theme.colors.secondary} />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
};

export default React.memo(HomeScreen);