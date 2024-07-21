import React, { useEffect, useCallback, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Animated, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DailyVerse from '../components/DailyVerse';
import { useTranslation } from 'react-i18next';
import { AnalyticsService } from '../services/AnalyticsService';
import { useReadingProgress } from '../context/ReadingProgressContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { t } = useTranslation();
  const readingProgressContext = useReadingProgress();
  const [lastRead, setLastRead] = useState(null);

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

    const loadLastRead = async () => {
      try {
        if (readingProgressContext && typeof readingProgressContext.getLastReadPosition === 'function') {
          const position = await readingProgressContext.getLastReadPosition();
          if (position) {
            setLastRead(position);
          }
        }
      } catch (error) {
        console.error('Error loading last read position:', error);
      }
    };
    loadLastRead();
  }, [readingProgressContext]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.isDarkMode ? '#121212' : '#F5F5F5',
    },
    header: {
      padding: 20,
      paddingTop: StatusBar.currentHeight + 20,
      backgroundColor: theme.colors.primary,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 18,
      color: '#FFFFFF',
      opacity: 0.8,
    },
    section: {
      margin: 20,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 15,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.isDarkMode ? '#1E1E1E' : '#FFFFFF',
      padding: 15,
      marginBottom: 10,
      borderRadius: 10,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    menuItemText: {
      marginLeft: 15,
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
    },
    startReadingButton: {
      backgroundColor: '#4CAF50',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: 20,
    },
    startReadingText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
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

  const handleStartReading = useCallback(() => {
    if (lastRead) {
      navigation.navigate('Bible', {
        screen: 'Verse',
        params: { book: lastRead.book, chapter: lastRead.chapter, verse: lastRead.verse }
      });
    } else {
      navigation.navigate('Bible', { screen: 'BibleList' });
    }
    AnalyticsService.logEvent('start_reading');
  }, [navigation, lastRead]);

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('appName')}</Text>
        <Text style={styles.headerSubtitle}>{t('dailyInspiration')}</Text>
      </View>
      
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
        <DailyVerse />
      </Animated.View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.startReadingButton} onPress={handleStartReading}>
          <Text style={styles.startReadingText}>
            {lastRead ? t('continueReading') : t('startReading')}
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t('quickAccess')}</Text>
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