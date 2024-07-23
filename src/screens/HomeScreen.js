import React, { useEffect, useCallback, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Animated, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DailyVerse from '../components/DailyVerse';
import { useTranslation } from 'react-i18next';
import { AnalyticsService } from '../services/AnalyticsService';
import { useReadingProgress } from '../context/ReadingProgressContext';
import LinearGradient from 'react-native-linear-gradient';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
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
      backgroundColor: isDarkMode ? '#121212' : '#F5F5F5',
    },
    gradientHeader: {
      height: 120,
    },
    header: {
      padding: 15,
      paddingTop: StatusBar.currentHeight + 10,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 16,
      color: isDarkMode ? '#CCCCCC' : '#666666',
      opacity: 0.8,
    },
    section: {
      margin: 15,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 10,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      padding: 12,
      marginBottom: 8,
      borderRadius: 8,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    menuItemText: {
      marginLeft: 12,
      fontSize: 16,
      color: colors.text,
      flex: 1,
    },
    startReadingButton: {
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 15,
    },
    startReadingText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  const menuItems = [
    { title: t('exploreTheBible'), icon: 'menu-book', screen: 'Bible' },
    { title: t('myFavoriteVerses'), icon: 'bookmark', screen: 'Bookmarks' },
    { title: t('bibleStudyPlan'), icon: 'event-note', screen: 'ReadingPlan' },
    { title: t('searchScriptures'), icon: 'search', screen: 'Search' },
    { title: t('appSettings'), icon: 'settings', screen: 'Settings' },
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
      <StatusBar backgroundColor={colors.primary} barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <LinearGradient
        colors={[colors.primary, isDarkMode ? '#121212' : '#F5F5F5']}
        style={styles.gradientHeader}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('eternalStoneBible')}</Text>
          <Text style={styles.headerSubtitle}>{t('dailyBibleInspiration')}</Text>
        </View>
      </LinearGradient>
      
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
        <DailyVerse />
      </Animated.View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.startReadingButton} onPress={handleStartReading}>
          <Text style={styles.startReadingText}>
            {lastRead ? t('continueYourBibleReading') : t('startYourBibleJourney')}
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t('quickBibleAccess')}</Text>
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
              <Icon name={item.icon} size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>{item.title}</Text>
              <Icon name="chevron-right" size={24} color={colors.secondary} />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
};

export default React.memo(HomeScreen);