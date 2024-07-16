import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBookmarks } from '../context/BookmarksContext';
import { useReadingPlan } from '../context/ReadingPlanContext';
import { useStyles } from '../hooks/useStyles';
import DailyVerse from '../components/DailyVerse';
import { useTranslation } from 'react-i18next';
import { withTheme } from '../hoc/withTheme';

const HomeScreen = ({ theme }) => {
  const navigation = useNavigation();
  const { bookmarks } = useBookmarks();
  const { currentPlan } = useReadingPlan();
  const { t } = useTranslation();
  const { colors } = theme;
  const styles = useStyles(createStyles);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);

  const renderButton = (text, onPress, testID) => (
    <AnimatedButton 
      style={[
        styles.button,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]} 
      onPress={onPress} 
      testID={testID}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </AnimatedButton>
  );

  return (
    <ScrollView style={styles.container} testID="home-screen">
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>{t('appName')}</Animated.Text>
      
      <Animated.View style={{ opacity: fadeAnim }}>
        <DailyVerse />
      </Animated.View>
      
      {renderButton(t('exploreBible'), () => navigation.navigate('BibleList'), 'explore-bible-button')}
      {renderButton(t('myBookmarks'), () => navigation.navigate('Bookmarks'), 'bookmarks-button')}
      {renderButton(t('viewReadingPlan'), () => navigation.navigate('ReadingPlan'), 'reading-plan-button')}
      {renderButton(t('searchBible'), () => navigation.navigate('Search'), 'search-bible-button')}
      {renderButton(t('settings'), () => navigation.navigate('Settings'), 'settings-button')}

      <Animated.View style={[styles.infoContainer, { opacity: fadeAnim }]}>
        <Text style={styles.infoText}>
          {t('readingPlan')}: {currentPlan ? currentPlan.name : t('notSelected')}
        </Text>
        <Text style={styles.infoText}>
          {t('bookmarks')}: {bookmarks.length}
        </Text>
      </Animated.View>
    </ScrollView>
  );
};

const createStyles = (colors, fontSize, fontFamily) => ({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoContainer: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  infoText: {
    color: colors.text,
    marginBottom: 5,
    fontSize: 16,
  },
});

export default withTheme(React.memo(HomeScreen));