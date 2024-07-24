import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { View, ScrollView, Text, StyleSheet, Animated, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import CustomIconButton from '../components/CustomIconButton';
import DailyVerse from '../components/DailyVerse';
import { useTranslation } from 'react-i18next';
import { AnalyticsService } from '../services/AnalyticsService';
import { useReadingProgress } from '../context/ReadingProgressContext';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();
  const readingProgressContext = useReadingProgress();
  const [lastRead, setLastRead] = useState(null);

  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const translateY = useMemo(() => new Animated.Value(50), []);

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
        console.error('Error al cargar la última posición de lectura:', error);
      }
    };
    loadLastRead();
  }, [readingProgressContext, fadeAnim, translateY]);

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
      fontSize: 28,
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
      margin: 20,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 15,
    },
    startReadingButton: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 12,
      alignItems: 'center',
      marginVertical: 20,
    },
    startReadingText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    menuGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    menuItem: {
      width: (width - 60) / 2, // 2 columnas con margen
      aspectRatio: 1,
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      borderRadius: 12,
      padding: 15,
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    menuItemText: {
      marginTop: 10,
      fontSize: 14,
      color: colors.text,
      textAlign: 'center',
    },
  });

  const menuItems = useMemo(() => [
    { title: t('Explorar\nla Biblia'), icon: 'book', screen: 'Biblia' },
    { title: t('Mis Versículos\nFavoritos'), icon: 'bookmark', screen: 'Favoritos' },
    { title: t('Plan de\nEstudio Bíblico'), icon: 'event-note', screen: 'ReadingPlan' },
    { title: t('Buscar en\nlas Escrituras'), icon: 'search', screen: 'Buscar' },
  ], [t]);

  const handleNavigation = useCallback((screen) => {
    navigation.navigate(screen);
    AnalyticsService.logEvent(`navigate_to_${screen.toLowerCase()}`);
  }, [navigation]);

  const handleStartReading = useCallback(() => {
    if (lastRead) {
      navigation.navigate('Biblia', {
        screen: 'Verse',
        params: { book: lastRead.book, chapter: lastRead.chapter, verse: lastRead.verse }
      });
    } else {
      navigation.navigate('Biblia', { screen: 'BibleList' });
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
          <Text style={styles.headerTitle}>Biblia Eterna</Text>
          <Text style={styles.headerSubtitle}>Inspiración Bíblica Diaria</Text>
        </View>
      </LinearGradient>
      
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
        <DailyVerse />
      </Animated.View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.startReadingButton} onPress={handleStartReading}>
          <Text style={styles.startReadingText}>
            {lastRead ? t('Continuar tu Lectura Bíblica') : t('Comenzar tu Viaje Bíblico')}
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t('Acceso Rápido a la Biblia')}</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleNavigation(item.screen)}
              accessibilityLabel={item.title}
              accessibilityRole="button"
            >
              <CustomIconButton name={item.icon} color={colors.primary} size={32} />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default React.memo(HomeScreen);